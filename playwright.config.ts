import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 10000,
  retries: 0,
  use: {
    baseURL: "http://localhost:8080",
    headless: true,
  },
});
