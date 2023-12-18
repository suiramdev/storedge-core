import { Resolver, Mutation, Ctx, Arg } from "type-graphql";
import { User, UserWhereInput, UserWhereUniqueInput, AffectedRowsOutput } from "@generated/type-graphql";
import { UnauthorizedError } from "@/utils/errors";
import { type Context } from "@/context";

@Resolver(() => User)
export class UserResolver {
    @Mutation(() => AffectedRowsOutput)
    async deleteManyUser(@Ctx() ctx: Context, @Arg("where") where: UserWhereInput): Promise<AffectedRowsOutput> {
        return ctx.prisma.user.deleteMany({ where: { ...where, persistent: false } });
    }

    @Mutation(() => User, { nullable: true })
    async deleteOneUser(@Ctx() ctx: Context, @Arg("where") where: UserWhereUniqueInput): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({ where });
        if (!user) return null;
        if (user.persistent) throw UnauthorizedError;

        return ctx.prisma.user.delete({ where });
    }
}
