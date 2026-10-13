import { defineConfig } from 'vite';
import { handleApi } from './server/api.mjs';

const api = { name: 'journeys-api', configureServer(server) { server.middlewares.use((req, res, next) => { handleApi(req, res).then(handled => { if (!handled) next(); }).catch(next); }); }, configurePreviewServer(server) { server.middlewares.use((req, res, next) => { handleApi(req, res).then(handled => { if (!handled) next(); }).catch(next); }); } };
export default defineConfig({
  plugins: [api],
  server: { allowedHosts: ['.replit.dev', '.repl.co'] }
});
