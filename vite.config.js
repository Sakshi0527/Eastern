import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
      routes: path.resolve(__dirname, 'src/routes'),
      module: path.resolve(__dirname, 'src/module'),
    },
  },
  server:{
    host: true,
  port: 3000
  }
});