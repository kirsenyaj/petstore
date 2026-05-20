import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [react()],
    server: { port: 3000 },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui'
              if (id.includes('framer-motion')) return 'vendor-motion'
              return 'vendor'
            }
          }
        }
      }
    }
  }
})
