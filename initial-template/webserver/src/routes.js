import url from 'url'
import UploadHandler from './uploadHandler.js'
import { logger } from './util.js'
import { pipeline } from 'node:stream/promises'

export default class Routes {
    #downloadsFolder
    constructor({ downloadsFolder }) {
        this.#downloadsFolder = downloadsFolder
    }
    async options(request, response) {
        console.log('passou options')
        response.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        })
        response.end()
    }

    get(request, response) {
        response.writeHead(200, { Connection: 'close' });
        response.end(`
            <html>
                <head><title>File Upload - Erick Wendel</title></head>
                <body>
                <form method="POST" enctype="multipart/form-data">
                    <input type="file" name="filefield"><br />
                    <input type="text" name="textfield"><br />
                    <input type="submit">
                </form>
                </body>
        </html>`
        );
    }
    async post(request, response) {
        const { headers } = request
        const redirectTo = headers.origin

        const uploadHandler = new UploadHandler({
            downloadsFolder: this.#downloadsFolder
        })

        const onFinish = (response, redirectTo) => () => {
            response.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            })
            response.end('Files uploaded with success!')
        }

        const busboyInstance = uploadHandler
            .registerEvents(
                headers,
                onFinish(response, redirectTo)
            )

        await pipeline(
            request,
            busboyInstance
        )

        logger.info('Request finished with success!')


    }
}