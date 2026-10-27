import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  server: { host: '127.0.0.1', port: 43187, strictPort: true },
  preview: { host: '127.0.0.1', port: 43188, strictPort: true },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    chunkSizeWarningLimit: 2000
  }
})
