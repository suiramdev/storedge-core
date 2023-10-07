import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    DEFAULT_ADMIN_EMAIL: z.string(),
    DEFAULT_ADMIN_PASSWORD: z.string(),
    SALT_ROUNDS: z.number().default(10),
    PORT: z.number().default(4000),
});

const env = envSchema.parse(process.env);

export default env;
