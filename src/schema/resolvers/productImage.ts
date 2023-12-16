import { Resolver, Arg, Mutation, Ctx, Authorized, InputType, Field } from "type-graphql";
import { ProductImage, AffectedRowsOutput } from "@generated/type-graphql";
import { type Context } from "@/context.js";

@InputType()
class ProductImageUpdateOrderInput {
    @Field()
    id!: string;
    @Field()
    orderIndex!: number;
}

@Resolver(() => ProductImage)
export class ProductImageResolver {
    @Authorized()
    @Mutation(() => AffectedRowsOutput)
    async updateProductImagesOrder(
        @Arg("data", () => [ProductImageUpdateOrderInput]) data: ProductImageUpdateOrderInput[],
        @Ctx() ctx: Context,
    ): Promise<AffectedRowsOutput> {
        const updateProductImagesOrder = await ctx.prisma.$transaction(
            data.map((input) =>
                ctx.prisma.productImage.update({
                    where: { id: input.id },
                    data: { orderIndex: input.orderIndex },
                }),
            ),
        );

        return { count: updateProductImagesOrder.length };
    }
}
