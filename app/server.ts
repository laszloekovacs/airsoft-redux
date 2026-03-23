// server.ts

import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { createHonoServer } from 'react-router-hono-server/node'

const app = new Hono()

// Public assets
app.use('/public/*', serveStatic({ root: './public' }))

// Let react-router-hono-server handle everything else (client assets + SSR + SPA fallback)
export default createHonoServer({
  // you can pass your own hono instance if you want to add api routes before
  app,

  // optional: customize static folders
  // serveStaticOptions: { ... }
})