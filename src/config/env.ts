import { z } from "zod";
import { config } from "dotenv";
import { BucketLocationConstraint } from "@aws-sdk/client-s3";

config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    DEFAULT_ADMIN_EMAIL: z.string(),
    DEFAULT_ADMIN_PASSWORD: z.string(),
    SALT_ROUNDS: z.number().default(10),
    PORT: z.number().default(4000),
    S3_BUCKET_NAME: z.string().default("storedge"),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.nativeEnum(BucketLocationConstraint),
});

const env = envSchema.parse(process.env);

export default env;
