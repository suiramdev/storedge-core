import { ObjectType, Field, Resolver, Arg, Mutation, Ctx, Authorized } from "type-graphql";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import Upload from "graphql-upload/Upload.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { NotFoundError } from "@/utils/errors";
import { type Context } from "@/context";
import env from "@/config/env";

@ObjectType()
class File {
    @Field()
    mimetype!: string;
    @Field()
    encoding!: string;
    @Field()
    url!: string;
}

@Resolver(() => File)
export class FileResolver {
    @Authorized()
    @Mutation(() => File)
    async uploadOneFile(
        @Arg("file", () => GraphQLUpload) file: Upload,
        @Arg("storeId", () => String) storeId: string,
        @Ctx() ctx: Context,
    ): Promise<File> {
        if ((await ctx.prisma.store.findUnique({ where: { id: storeId } })) === null) throw NotFoundError;

        const fileUpload = await file.promise;

        const command = new PutObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: `${storeId}/${uuid()}`,
            Body: fileUpload.createReadStream(),
            ContentEncoding: fileUpload.encoding,
            ContentType: fileUpload.mimetype,
        });
        await ctx.s3.send(command);

        return {
            mimetype: fileUpload.mimetype,
            encoding: fileUpload.encoding,
            url: `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com/${storeId}/${command.input.Key}`,
        };
    }
}
