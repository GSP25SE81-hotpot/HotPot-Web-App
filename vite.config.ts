import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
  },
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true, // Helps debugging
  },
  envPrefix: ["VITE_", "REACT_APP_"], // Only expose these prefixes
});
