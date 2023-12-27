FROM node:16.20.2-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
# Faster dependency install with pnpm
RUN npm install -g pnpm
COPY . .

FROM base AS build
RUN pnpm install
# Can't use pnpm dlx becuase it doesn't support typegraphql-prisma for some reason
RUN pnpm run db:generate
RUN pnpm run build

FROM base
WORKDIR /app
RUN pnpm install --prod
COPY --from=build /app/node_modules/@generated ./node_modules/@generated/type-graphql
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/schema.prisma ./schema.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY --from=build /app/schema.prisma ./schema.prisma
ENV NODE_ENV production
EXPOSE 4000
ENTRYPOINT [ "./entrypoint.sh" ]
