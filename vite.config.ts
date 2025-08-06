import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Set base URL for GitHub Pages
    const base = mode === 'production' ? '/SmartAdvisor/' : '/';
    
    return {
      base,
      define: {
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              charts: ['recharts'],
              ai: ['@google/genai']
            }
          }
        },
        chunkSizeWarningLimit: 1000
      }
    };
});
