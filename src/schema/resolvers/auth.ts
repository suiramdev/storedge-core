import { randomUUID } from "node:crypto";
import { User } from "@generated/type-graphql";
import { ObjectType, Field, Resolver, Mutation, Arg, Ctx, Authorized, Query } from "type-graphql";
import bcrypt from "bcrypt";
import { type Context } from "@/context";
import { TokenType, generateTokens, verifyToken } from "@/utils/token";
import { InvalidRefreshTokenError, UnauthenticatedError, UserNotFoundError, WrongPasswordError } from "@/utils/errors";

@ObjectType()
export class Auth {
    @Field()
    accessToken!: string;

    @Field()
    refreshToken!: string;
}

@Resolver()
export class AuthResolver {
    @Mutation(() => Auth)
    async generateToken(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: Context,
    ): Promise<Auth> {
        const user = await ctx.prisma.user.findUnique({ where: { email } });
        if (!user) throw UserNotFoundError;
        if (!(await bcrypt.compare(password, user.password))) throw WrongPasswordError;

        const newSessionId = randomUUID();

        await ctx.prisma.user.update({
            where: { id: user.id },
            data: { sessionId: newSessionId },
        });

        return generateTokens(newSessionId);
    }

    @Mutation(() => Auth)
    async refreshToken(@Arg("refreshToken") refreshToken: string, @Ctx() ctx: Context): Promise<Auth> {
        const decoded = verifyToken(refreshToken, TokenType.REFRESH);

        const user = await ctx.prisma.user.findUnique({
            where: { sessionId: decoded.sessionId },
        });
        if (!user) throw InvalidRefreshTokenError;

        return generateTokens(user.sessionId);
    }

    @Authorized()
    @Mutation(() => Boolean)
    async revokeToken(@Ctx() ctx: Context): Promise<boolean> {
        const decoded = verifyToken(ctx.token!, TokenType.ACCESS);

        const user = await ctx.prisma.user.update({
            where: { sessionId: decoded.sessionId },
            data: { sessionId: randomUUID() },
        });
        if (!user) throw UnauthenticatedError;

        return true;
    }

    @Authorized()
    @Query(() => User)
    async me(@Ctx() ctx: Context): Promise<User> {
        const decoded = verifyToken(ctx.token!, TokenType.ACCESS);

        const user = await ctx.prisma.user.findUnique({
            where: { sessionId: decoded.sessionId },
        });
        if (!user) throw UnauthenticatedError;

        return user;
    }
}
