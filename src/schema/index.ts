import { resolvers } from "@generated/type-graphql";
import { buildSchemaSync } from "type-graphql";
import { AuthResolver, UserResolver } from "@/schema/resolvers";
import { authChecker } from "@/schema/auth";

const schema = buildSchemaSync({
    resolvers: [...resolvers, AuthResolver, UserResolver],
    validate: false,
    authChecker,
});

export default schema;
