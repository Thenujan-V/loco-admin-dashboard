import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
})
