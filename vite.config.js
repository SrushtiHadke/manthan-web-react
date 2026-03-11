import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',         // '/' works for custom domain (manthankhandale.com)
                     // Change to '/repo-name/' if using github.io URL without custom domain
  build: {
    outDir: 'dist',
  },
})
