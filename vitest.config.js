import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true, // ← add
      setupFiles: ['./tests/setup.js'], // ← add
      exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.next/**', '**/e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
