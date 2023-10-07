import { type ResolversEnhanceMap, applyResolversEnhanceMap } from "@generated/type-graphql";
import { Authorized } from "type-graphql";

export const enhanceMap: ResolversEnhanceMap = {
    Shop: {
        _query: [Authorized("read:shop")],
        _mutation: [Authorized("create:shop", "update:shop", "delete:shop")],
    },
    Collection: {
        _query: [Authorized("read:collection")],
        _mutation: [Authorized("create:collection", "update:collection", "delete:collection")],
    },
    Product: {
        _query: [Authorized("read:product")],
        _mutation: [Authorized("create:product", "update:product", "delete:product")],
    },
    ProductVariant: {
        _query: [Authorized("read:product")],
        _mutation: [Authorized("create:product", "update:product", "delete:product")],
    },
    ProductOption: {
        _query: [Authorized("read:product")],
        _mutation: [Authorized("create:product", "update:product", "delete:product")],
    },
    ProductOptionValue: {
        _query: [Authorized("read:product")],
        _mutation: [Authorized("create:product", "update:product", "delete:product")],
    },
    ProductImage: {
        _query: [Authorized("read:product")],
        _mutation: [Authorized("create:product", "update:product", "delete:product")],
    },
    Role: {
        _query: [Authorized("read:role")],
        _mutation: [Authorized("create:role", "update:role", "delete:role")],
    },
    User: {
        _query: [Authorized("read:user")],
        _mutation: [Authorized("create:user", "update:user", "delete:user")],
    },
};

applyResolversEnhanceMap(enhanceMap);
