import { FastifyInstance } from "fastify";
import { zodToJsonSchema as $ref } from "zod-to-json-schema";
import { getWeather } from "./weather.handlers";
import {
  getWeatherQuerySchema,
  weatherResponseSchema,
} from "weather-service/src/schemas";

export const weatherRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["weather"],
        summary: "Get current weather for a city",
        description:
          "Returns the current weather forecast for the specified city using WeatherAPI.com.",
        querystring: $ref(getWeatherQuerySchema),
        produces: ["application/json"],
        response: {
          200: {
            description:
              "Successful operation - current weather forecast returned",
            ...$ref(weatherResponseSchema),
          },
          400: { description: "Invalid request" },
          404: { description: "City not found" },
        },
      },
    },
    getWeather
  );
};
