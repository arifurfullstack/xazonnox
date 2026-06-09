import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import * as dotenv from 'dotenv';
import fs from 'node:fs';

// Load environment variables
dotenv.config();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // Serve shop-settings.json dynamically from external volume mount or fallback to local browser dist folder
  server.get('/shop-settings.json', (req, res) => {
    const externalPath = join('/app', 'settings', 'shop-settings.json');
    const localPath = join(browserDistFolder, 'shop-settings.json');
    if (fs.existsSync(externalPath)) {
      res.sendFile(externalPath);
    } else if (fs.existsSync(localPath)) {
      res.sendFile(localPath);
    } else {
      res.status(404).json({ error: 'shop-settings.json not found' });
    }
  });

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => {
        const apiBaseLink = process.env['API_BASE_LINK'] || `${protocol}://api.${headers.host.replace('www.', '')}`;
        const envScript = `<script>window.__env = { apiBaseLink: '${apiBaseLink}' };</script>`;
        const modifiedHtml = html.replace('</head>', `${envScript}</head>`);
        res.send(modifiedHtml);
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4220;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
