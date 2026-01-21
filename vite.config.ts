import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      VITE_PVWS_SOCKET: "pvws.diamond.ac.uk",
      VITE_PVWS_SSL: "true",
    },
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      blueapi: path.resolve(__dirname, "./src/blueapi"),
      components: path.resolve(__dirname, "./src/components"),
      context: path.resolve(__dirname, "./src/context"),
      pv: path.resolve(__dirname, "./src/pv"),
      routes: path.resolve(__dirname, "./src/routes"),
      screens: path.resolve(__dirname, "./src/screens"),
    },
  },
  base: "/mx-daq-ui/",
});
