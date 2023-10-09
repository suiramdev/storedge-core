import { Resolver, FieldResolver, Root } from "type-graphql";
import { Product } from "@generated/type-graphql";

@Resolver(() => Product)
export class ProductResolver {
  @FieldResolver(() => Number, { nullable: true })
  minPrice(@Root() product: Product): number | null {
    if (!product.variants) return null;
    return product.variants.reduce((min, variant) => Math.min(min, variant.price.toNumber()), 0);
  }

  @FieldResolver(() => Number, { nullable: true })
  avgPrice(@Root() product: Product): number | null {
    if (!product.variants) return null;
    return product.variants.reduce((sum, variant) => sum + variant.price.toNumber(), 0) / product.variants.length;
  }

  @FieldResolver(() => Number, { nullable: true })
  maxPrice(@Root() product: Product): number | null {
    if (!product.variants) return null;
    return product.variants.reduce((max, variant) => Math.max(max, variant.price.toNumber()), 0);
  }
}
