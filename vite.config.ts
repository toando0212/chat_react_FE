/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@css': path.resolve(__dirname, './css'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
