import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig(() => {
  return {
    plugins: [react(), svgr()],
    base: "/",
    resolve: {
      alias: {
        "@assets": "/src/assets",
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@context": "/src/context",
        "@t": "/src/types",
      },
    },
  };
});
