import { defineConfig } from "vite";
import path from "path"
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { imagetools } from "vite-imagetools";
import tsconfigPaths from "vite-tsconfig-paths";

import { SITE } from "./src/config.mjs";

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({
        trailingSlash: SITE.trailingSlash,
      }),
      qwikVite(),
      tsconfigPaths(),
      imagetools(),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
