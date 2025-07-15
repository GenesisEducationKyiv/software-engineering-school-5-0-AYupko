import { FastifyReply, FastifyRequest } from "fastify";
import { weatherService } from "weather-service/src/business/services";
import {
  GetWeatherQuery,
  GetWeatherResponse,
} from "weather-service/src/schemas";

const getWeather = async (
  request: FastifyRequest<{ Querystring: GetWeatherQuery }>,
  reply: FastifyReply
) => {
  const city = request.query.city;

  const data = await weatherService.getWeather({ city });

  const response: GetWeatherResponse = data.weather;

  return reply.code(200).send(response);
};

export { getWeather };
