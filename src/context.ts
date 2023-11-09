import type { BaseContext, ContextFunction } from "@apollo/server";
import type { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
import env from "@/config/env";

export interface Context extends BaseContext {
    prisma: PrismaClient;
    s3: S3Client;
    token?: string;
}

const context: ContextFunction<[StandaloneServerContextFunctionArgument], Context> = async ({
    req,
}): Promise<Context> => ({
    prisma: new PrismaClient(),
    s3: new S3Client({
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
    }),
    token: req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.substring(7) : undefined,
});

export default context;
