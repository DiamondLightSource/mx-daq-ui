import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      blueapi: path.resolve(__dirname, "./src/blueapi"),
      components: path.resolve(__dirname, "./src/components"),
      pv: path.resolve(__dirname, "./src/pv"),
      routes: path.resolve(__dirname, "./src/routes"),
      screens: path.resolve(__dirname, "./src/screens"),
    },
  },
});
