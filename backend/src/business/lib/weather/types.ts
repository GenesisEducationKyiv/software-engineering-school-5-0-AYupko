import { z } from "zod";

export const weatherAPIResponseSchema = z.object({
  temp_c: z.number(),
  humidity: z.number(),
  condition: z.object({
    text: z.string(),
  }),
});

export type WeatherAPIResponse = z.infer<typeof weatherAPIResponseSchema>;

type WeatherSuccess = {
  success: true;
  data: {
    temperature: number;
    humidity: number;
    description: string;
  };
};

type WeatherFailure = {
  success: false;
};

export type WeatherProvider = (params: {
  city: string;
}) => Promise<WeatherSuccess | WeatherFailure>;
