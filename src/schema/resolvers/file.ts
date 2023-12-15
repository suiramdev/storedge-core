import { ObjectType, Field, Resolver, Arg, Mutation, Ctx, Authorized, FieldResolver, Root } from "type-graphql";
import { File } from "@generated/type-graphql";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { NotFoundError } from "@/utils/errors";
import { type Context } from "@/context";
import env from "@/config/env";

@ObjectType()
class StagedFile {
    @Field()
    uploadUrl!: string;
    @Field()
    bucket!: string;
    @Field()
    key!: string;
    @Field()
    contentType!: string;
}

@Resolver(() => File)
export class FileResolver {
    @Authorized()
    @Mutation(() => StagedFile)
    async stageOneFile(
        @Arg("mimeType") mimeType: string,
        @Arg("storeId") storeId: string,
        @Ctx() ctx: Context,
    ): Promise<StagedFile> {
        if ((await ctx.prisma.store.findUnique({ where: { id: storeId } })) === null) throw NotFoundError;

        const command = new PutObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: `${storeId}/${uuid()}`,
            ContentType: mimeType,
        });

        return {
            uploadUrl: await getSignedUrl(ctx.s3, command, { expiresIn: 3600 }),
            bucket: env.S3_BUCKET_NAME,
            key: command.input.Key!,
            contentType: mimeType,
        };
    }

    @Authorized()
    @Mutation(() => [StagedFile])
    async stageManyFile(
        @Arg("mimeTypes", () => [String]) mimeTypes: string[],
        @Arg("storeId") storeId: string,
        @Ctx() ctx: Context,
    ): Promise<StagedFile[]> {
        if ((await ctx.prisma.store.findUnique({ where: { id: storeId } })) === null) throw NotFoundError;

        return Promise.all(
            mimeTypes.map(async (mimeType) => {
                const command = new PutObjectCommand({
                    Bucket: env.S3_BUCKET_NAME,
                    Key: `${storeId}/${uuid()}`,
                    ContentType: mimeType,
                });

                return {
                    uploadUrl: await getSignedUrl(ctx.s3, command, { expiresIn: 3600 }),
                    bucket: env.S3_BUCKET_NAME,
                    key: command.input.Key!,
                    contentType: mimeType,
                };
            }),
        );
    }

    @FieldResolver(() => String)
    async url(@Root() file: File, @Ctx() ctx: Context): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: file.bucket,
            Key: file.key,
        });

        return await getSignedUrl(ctx.s3, command, { expiresIn: 3600 });
    }
}
