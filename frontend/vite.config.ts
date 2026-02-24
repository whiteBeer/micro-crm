import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import vue2Jsx from '@vitejs/plugin-vue2-jsx';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false
            }
        }
    },
    plugins: [
        vue2(),
        vue2Jsx()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 3001,
        host: true, // important for Docker
        watch: {
            usePolling: true
        },
        proxy: {
            '/api': {
                target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            },
            '/socket.io': {
                target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
                changeOrigin: true,
                ws: true,
                secure: false
            }
        }
    }
});
