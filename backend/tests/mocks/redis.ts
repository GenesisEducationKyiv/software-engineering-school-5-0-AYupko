import Redis from "ioredis";

export const createMockRedis = (): jest.Mocked<Redis> => {
  return {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    flushall: jest.fn(),
    quit: jest.fn(),
  } as unknown as jest.Mocked<Redis>;
};