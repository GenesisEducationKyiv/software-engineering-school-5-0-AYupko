FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]