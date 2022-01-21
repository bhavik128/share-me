import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      "GOOGLE_API_CLIENT_ID",
      "SANITY_PROJECT_ID",
      "SANITY_PROJECT_TOKEN",
    ]),
  ],
});
