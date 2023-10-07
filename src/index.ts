import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "@/schema";
import context, { type Context } from "@/context";
import env from "@/config/env";

const server = new ApolloServer<Context>({ schema });

startStandaloneServer(server, {
    context,
    listen: { port: env.PORT },
})
    .then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => {
        console.error(error);
    });
