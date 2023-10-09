import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import env from "@/config/env";

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
    const userFound = await prisma.user.findUnique({
        where: { email: env.DEFAULT_ADMIN_EMAIL },
    });
    if (userFound) throw new Error("Default user already exist");

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
};

main().finally(() => prisma.$disconnect());
