import pino from 'pino'

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: 'pid,hostname'
        }
    },
})

export {
    logger,
}