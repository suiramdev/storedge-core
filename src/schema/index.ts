import { resolvers } from "@generated/type-graphql";
import { buildSchemaSync } from "type-graphql";
import { AuthResolver, UserResolver, ProductResolver } from "@/schema/resolvers";
import { authChecker } from "@/schema/auth";

const schema = buildSchemaSync({
    resolvers: [...resolvers, AuthResolver, UserResolver, ProductResolver],
    validate: false,
    authChecker,
});

export default schema;
