import type { AuthChecker } from "type-graphql";
import type { Context } from "@/context";
import { verifyToken } from "@/utils/token";
import { UnauthenticatedError, UnauthorizedError } from "@/utils/errors";

export const authChecker: AuthChecker<Context> = async ({ context }, scopes) => {
    if (!context.token) throw UnauthenticatedError;

    const decoded = verifyToken(context.token);

    const user = await context.prisma.user.findUnique({
        where: { sessionId: decoded.sessionId },
        include: { role: true },
    });
    if (!user) throw UnauthenticatedError;

    if (scopes.length > 0) {
        if (scopes.every((scope) => user.role.scopes.includes(scope))) return true;
        throw UnauthorizedError;
    }
    return true;
};
