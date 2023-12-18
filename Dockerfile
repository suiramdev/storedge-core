FROM node:16 as build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate && \
  npm run build

FROM node:16-slim
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev
COPY --chown=node:node --from=build /usr/src/app/node_modules/@generated/type-graphql  ./node_modules/@generated/type-graphql
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client
COPY --chown=node:node --from=build /usr/src/app/schema.prisma ./schema.prisma

ENV NODE_ENV production
EXPOSE 4000
COPY --chown=node:node --from=build /usr/src/app/start.sh ./start.sh

CMD ["./start.sh"]
