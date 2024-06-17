import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'main.js')
        },
        outDir: 'dist-electron/main'
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'preload.js')
        },
        outDir: 'dist-electron/preload'
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main.jsx')
        },
        outDir: 'dist-electron/renderer'
      }
    }
  }
})