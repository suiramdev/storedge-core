import type { BaseContext, ContextFunction } from "@apollo/server";
import type { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";

export interface Context extends BaseContext {
    prisma: PrismaClient;
    token?: string;
}

const context: ContextFunction<[StandaloneServerContextFunctionArgument], Context> = async ({
    req,
}): Promise<Context> => ({
    prisma: new PrismaClient(),
    token: req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.substring(7) : undefined,
});

export default context;
