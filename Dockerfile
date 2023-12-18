FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

RUN npx prisma db push

RUN npx prisma db seed

RUN npm run start
