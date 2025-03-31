import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production" || mode === "preview";

  return {
    plugins: [react(), svgr()],
    base: isProduction ? "/vetAriels/" : "/",
    resolve: {
      alias: {
        "@assets": "/src/assets",
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@context": "/src/context",
      },
    },
  };
});
