import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: nome do repositório no GitHub. O Pages serve o site em
  // https://vanessa041.github.io/sleepwise/ (subpasta), então os arquivos
  // precisam ser buscados a partir de /sleepwise/.
  base: '/sleepwise/',
  plugins: [react()],
})
