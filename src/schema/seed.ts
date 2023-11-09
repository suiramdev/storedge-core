import { PrismaClient } from "@prisma/client";
import { S3Client, CreateBucketCommand, PutPublicAccessBlockCommand, PutBucketAclCommand } from "@aws-sdk/client-s3";
import { hash } from "bcrypt";
import env from "@/config/env";

const prisma = new PrismaClient();

const s3 = new S3Client({
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    region: env.S3_REGION,
});

const main = async (): Promise<void> => {
    const userFound = await prisma.user.findUnique({
        where: { email: env.DEFAULT_ADMIN_EMAIL },
    });
    if (!userFound) {
        const models = ["store", "collection", "product", "role", "user"];

        await prisma.user.create({
            data: {
                email: env.DEFAULT_ADMIN_EMAIL,
                password: await hash(env.DEFAULT_ADMIN_PASSWORD, env.SALT_ROUNDS),
                persistent: true,
                role: {
                    connectOrCreate: {
                        where: {
                            name: "ADMIN",
                        },
                        create: {
                            name: "ADMIN",
                            scopes: [
                                ...models.map((model) => `create:${model}`),
                                ...models.map((model) => `read:${model}`),
                                ...models.map((model) => `update:${model}`),
                                ...models.map((model) => `delete:${model}`),
                            ],
                            persistent: true,
                        },
                    },
                },
            },
        });
    }

    await s3.send(
        new CreateBucketCommand({
            Bucket: env.S3_BUCKET_NAME,
            CreateBucketConfiguration: {
                LocationConstraint: env.S3_REGION,
            },
            ObjectOwnership: "BucketOwnerPreferred",
        }),
    );

    await s3.send(
        new PutPublicAccessBlockCommand({
            Bucket: env.S3_BUCKET_NAME,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                BlockPublicPolicy: false,
                IgnorePublicAcls: false,
                RestrictPublicBuckets: false,
            },
        }),
    );

    await s3.send(
        new PutBucketAclCommand({
            Bucket: env.S3_BUCKET_NAME,
            ACL: "public-read",
        }),
    );
};

main().finally(() => prisma.$disconnect());
