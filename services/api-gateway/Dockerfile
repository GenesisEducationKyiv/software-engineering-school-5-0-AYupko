FROM node:18-alpine

WORKDIR /app/services/api-gateway

COPY ./services/api-gateway/package*.json ./
RUN npm install

COPY ./services/tsconfig.json /app/services/tsconfig.json

COPY ./services/api-gateway/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]