import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      VITE_PVWS_SOCKET: "pvws.diamond.ac.uk",
      VITE_PVWS_SSL: "true",
    },
  },
  test: {
    environment: "jsdom",
  },
} as UserConfig);
