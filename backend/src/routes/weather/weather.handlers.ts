import { weatherService } from "@/business/services/weather";
import { GetWeatherQuery, GetWeatherResponse } from "@/schemas/weather.schema";
import { FastifyReply, FastifyRequest } from "fastify";

const getWeather = async (
  request: FastifyRequest<{ Querystring: GetWeatherQuery }>,
  reply: FastifyReply
) => {
  const city = request.query.city;

  const data = await weatherService.getWeather({ city });

  const response: GetWeatherResponse = data.weather;

  console.log("response:", response);

  return reply.code(200).send(response);
};

export { getWeather };
