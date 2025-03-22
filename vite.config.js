import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react(), svgr()],
  base: isProduction ? "https://Efrexz.github.io/vetAriels/" : "/", // Base solo en producción
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@context": "/src/context",
    },
  },
});
