import http from 'node:http'
import fs from 'node:fs/promises'
import { join } from  'node:path'
import url from 'node:url'
import Routes from './routes.js'
import { logger } from './util.js'
const PORT = 3000

const dirName = url.fileURLToPath(new URL(import.meta.url))

const downloadsFolder = join(dirName, '../../', 'downloads')

const handler = function (request, response) {
    const defaultRoute = async (request, response) => response.end('Hello!')
    const routes = new Routes({
        downloadsFolder
    })
    const chosen = routes[request.method.toLowerCase()] || defaultRoute

    return chosen.apply(routes, [request, response])
}

const server = http.createServer(handler)
await fs.rm(downloadsFolder, { recursive: true, force: true })
await fs.mkdir(downloadsFolder)

const startServer = () => {
    const { address, port } = server.address()
    logger.info(`app running at http://${address}:${port}`)
}

server.listen(PORT, startServer)

// curl -X POST -F "video.mp4=@big2m.mp4" http://localhost:3000