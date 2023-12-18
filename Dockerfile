FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm build

RUN npx prisma db push

RUN npx prisma db seed

RUN npm start
