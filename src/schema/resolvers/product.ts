import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";
import { Product } from "@generated/type-graphql";
import { type Context } from "@/context.js";

@Resolver(() => Product)
export class ProductResolver {
    @FieldResolver(() => Number, { nullable: true })
    async minPrice(@Root() product: Product, @Ctx() ctx: Context): Promise<number | null> {
        const variants = await ctx.prisma.product.findUnique({ where: { id: product.id } }).variants();
        if (!variants || variants.length === 0) return product.price.toNumber();
        const prices = [product.price.toNumber(), ...variants.map((variant) => variant.price.toNumber())];
        return prices.reduce((min, price) => Math.min(min, price), 0);
    }

    @FieldResolver(() => Number, { nullable: true })
    async avgPrice(@Root() product: Product, @Ctx() ctx: Context): Promise<number | null> {
        const variants = await ctx.prisma.product.findUnique({ where: { id: product.id } }).variants();
        if (!variants || variants.length === 0) return product.price.toNumber();
        const prices = [product.price.toNumber(), ...variants.map((variant) => variant.price.toNumber())];
        return prices.reduce((sum, price) => sum + price, 0) / prices.length;
    }

    @FieldResolver(() => Number, { nullable: true })
    async maxPrice(@Root() product: Product, @Ctx() ctx: Context): Promise<number | null> {
        const variants = await ctx.prisma.product.findUnique({ where: { id: product.id } }).variants();
        if (!variants || variants.length === 0) return product.price.toNumber();
        const prices = [product.price.toNumber(), ...variants.map((variant) => variant.price.toNumber())];
        return prices.reduce((max, price) => Math.max(max, price), 0);
    }
}
