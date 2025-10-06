import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Publicado como Project Page en: https://saturdaysai.github.io/hollowknight/
export default defineConfig({
  plugins: [react()],
  base: "/hollowknight/",
  build: {
    outDir: "dist",
  },
});
