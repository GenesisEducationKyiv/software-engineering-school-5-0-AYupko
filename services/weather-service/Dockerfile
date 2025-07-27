FROM node:18-alpine

WORKDIR /app/services/weather-service

COPY ./services/weather-service/package*.json ./
RUN npm install

COPY ./services/tsconfig.json /app/services/tsconfig.json

COPY ./services/weather-service/ ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]