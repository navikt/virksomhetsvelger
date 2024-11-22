import { defineConfig } from "vite";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { glob } from "glob";

// setup for building a library with vitejs
// based on https://github.com/receter/my-component-library/blob/no-css-injection

export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.lib.json", rollupTypes: true }),
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
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob
          .sync("lib/**/*.{ts,tsx}", {
            ignore: ["lib/**/*.d.ts"],
          })
          .map((file) => [
            // 1. The name of the entry point
            // lib/nested/foo.js becomes nested/foo
            relative("lib", file.slice(0, file.length - extname(file).length)),
            // 2. The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
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
