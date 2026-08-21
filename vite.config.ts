import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Where the i24 OAV's MJPG server lives, for when the environment does not say.
const OAV_STREAM_SERVER = "http://bl24i-di-serv-01.diamond.ac.uk:8080";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "VITE_");
  return {
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
    server: {
      // blueapi is addressed as the origin-relative /api (see src/blueapi/blueapi.ts);
      // in production something upstream routes that, so in dev we proxy it ourselves.
      proxy: {
        "/api": {
          target: env.VITE_BLUEAPI_SOCKET_DEV ?? "http://localhost:25565",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
        // The OAV stream is served from this origin too, so that an https deployment
        // is not blocked from loading it over http (see oavStreamUrl). In production
        // nginx proxies it; here we do.
        "/oav-stream": {
          target: env.VITE_OAV_STREAM_SOCKET_DEV ?? OAV_STREAM_SERVER,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/oav-stream/, ""),
        },
      },
    },
  };
});
