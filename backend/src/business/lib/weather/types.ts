import { z } from "zod";

export const weatherAPIResponseSchema = z.object({
  temp_c: z.number(),
  humidity: z.number(),
  condition: z.object({
    text: z.string(),
  }),
});

export type WeatherAPIResponse = z.infer<typeof weatherAPIResponseSchema>;

export type WeatherSuccess = {
  success: true;
  data: {
    temperature: number;
    humidity: number;
    description: string;
  };
};

export type WeatherFailure = {
  success: false;
};
