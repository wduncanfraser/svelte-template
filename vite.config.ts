import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/api': { target: 'http://localhost:8080', changeOrigin: true },
			'/login': { target: 'http://localhost:8080', changeOrigin: true },
			'/logout': { target: 'http://localhost:8080', changeOrigin: true },
			'/callback': { target: 'http://localhost:8080', changeOrigin: true }
		}
	}
});
