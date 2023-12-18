FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

RUN npx prisma db generate

EXPOSE 3000

CMD ["npm", "run", "start"]
