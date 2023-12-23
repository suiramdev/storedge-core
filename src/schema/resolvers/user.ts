import { Resolver, Authorized, Mutation, Ctx, Arg } from "type-graphql";
import {
    User,
    UserCreateInput,
    AffectedRowsOutput,
    UserCreateManyInput,
    UserWhereUniqueInput,
    UserWhereInput,
    UserUpdateInput,
    UserUpdateManyMutationInput,
} from "@generated/type-graphql";
import { UnauthorizedError } from "@/utils/errors";
import { type Context } from "@/context";
import bcrypt from "bcrypt";

@Resolver(() => User)
export class UserResolver {
    @Authorized()
    @Mutation(() => User, { nullable: true })
    async createOneUser(@Ctx() ctx: Context, @Arg("data") data: UserCreateInput): Promise<User | null> {
        return ctx.prisma.user.create({
            data: {
                ...data,
                password: await bcrypt.hash(data.password, 10),
            },
        });
    }

    @Authorized()
    @Mutation(() => AffectedRowsOutput)
    async createManyUser(@Ctx() ctx: Context, @Arg("data") data: UserCreateManyInput): Promise<AffectedRowsOutput> {
        return ctx.prisma.user.createMany({ data: { ...data, password: await bcrypt.hash(data.password, 10) } });
    }

    @Authorized()
    @Mutation(() => User, { nullable: true })
    async updateOneUser(
        @Ctx() ctx: Context,
        @Arg("where") where: UserWhereUniqueInput,
        @Arg("data") data: UserUpdateInput,
    ): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({ where });
        if (!user) return null;
        if (user.persistent) throw UnauthorizedError;

        return ctx.prisma.user.update({
            where,
            data: {
                ...data,
                password: data.password?.set && { set: await bcrypt.hash(data.password.set, 10) },
            },
        });
    }

    @Authorized()
    @Mutation(() => AffectedRowsOutput)
    async updateManyUser(
        @Ctx() ctx: Context,
        @Arg("where") where: UserWhereInput,
        @Arg("data") data: UserUpdateManyMutationInput,
    ): Promise<AffectedRowsOutput> {
        return ctx.prisma.user.updateMany({
            where: { ...where, persistent: false },
            data: {
                ...data,
                password: data.password?.set && { set: await bcrypt.hash(data.password.set, 10) },
            },
        });
    }

    @Authorized()
    @Mutation(() => User, { nullable: true })
    async upsertOneUser(
        @Ctx() ctx: Context,
        @Arg("where") where: UserWhereUniqueInput,
        @Arg("create") create: UserCreateInput,
        @Arg("update") update: UserUpdateInput,
    ): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({ where });
        if (user && user.persistent) throw UnauthorizedError;

        return ctx.prisma.user.upsert({
            where,
            create: {
                ...create,
                password: await bcrypt.hash(create.password, 10),
            },
            update: {
                ...update,
                password: update.password?.set && { set: await bcrypt.hash(update.password.set, 10) },
            },
        });
    }

    @Authorized()
    @Mutation(() => User, { nullable: true })
    async deleteOneUser(@Ctx() ctx: Context, @Arg("where") where: UserWhereUniqueInput): Promise<User | null> {
        const user = await ctx.prisma.user.findUnique({ where });
        if (!user) return null;
        if (user.persistent) throw UnauthorizedError;

        return ctx.prisma.user.delete({ where });
    }

    @Authorized()
    @Mutation(() => AffectedRowsOutput)
    async deleteManyUser(@Ctx() ctx: Context, @Arg("where") where: UserWhereInput): Promise<AffectedRowsOutput> {
        return ctx.prisma.user.deleteMany({ where: { ...where, persistent: false } });
    }
}
