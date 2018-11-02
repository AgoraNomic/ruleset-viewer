import express from 'express'
import next from 'next'
import {getGitHubData} from './lib/github-api'

const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.get('/data', async (_req, res) => {
      res.send(await getGitHubData());
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err: Error) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })