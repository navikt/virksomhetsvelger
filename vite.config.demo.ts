import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => {
  return {
    base: "/virksomhetsvelger/",
    plugins: [react()],
    build: {
      outDir: "demo",
      sourcemap: true,
    },
  };
});
