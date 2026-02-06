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
      "#": path.resolve(__dirname, "src"), // <-- maps #/* → src/*
    },
  },

  base: "/mx-daq-ui/",
});
