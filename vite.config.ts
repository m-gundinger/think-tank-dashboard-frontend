import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// No longer import tailwindcss from @tailwindcss/vite
export default defineConfig({
  // Remove the tailwindcss() plugin
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});