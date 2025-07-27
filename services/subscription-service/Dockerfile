FROM node:18-alpine

WORKDIR /app/services/subscription-service

COPY ./services/subscription-service/package*.json ./
RUN npm install

COPY ./services/tsconfig.json /app/services/tsconfig.json

COPY ./services/subscription-service/ ./

RUN npx prisma generate

RUN npm run build

EXPOSE 3002

CMD ["sh", "-c", "npm run prisma:deploy && npm start"]
