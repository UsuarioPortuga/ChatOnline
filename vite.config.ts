import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["z42wpv-5173.csb.app"], // 🔹 Adicione seu host aqui
  },
});
