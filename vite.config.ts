import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

// setup for building a library with vitejs
// based on https://github.com/receter/my-component-library/blob/no-css-injection

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "@navikt/ds-react"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names.some(name => name.endsWith(".css"))) {
            return "assets/style.css";
          }
          return "assets/[name].[ext]";
        },
        entryFileNames: "[name].js",
      },
    },
  },
  server: {
    port: 1337,
    watch: {
      // trigger a rebuild of demo app when production code changes
      ignored: ["!**/dist/**"],
    },
    open: true,
  },
});
