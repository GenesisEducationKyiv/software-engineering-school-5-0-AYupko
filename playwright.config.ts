import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://frontend:80",
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 15000,
  },
  expect: {
      timeout: 10000,
    },
});
