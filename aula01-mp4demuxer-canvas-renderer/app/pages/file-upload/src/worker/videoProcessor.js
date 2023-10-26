export default class VideoProcessor {
    #mp4Demuxer
    /**
     *
     * @param {object} options
     * @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
     */
    constructor({ mp4Demuxer }) {
        this.#mp4Demuxer = mp4Demuxer
    }
    /** @returns {ReadableStream} */
    mp4Decoder(encoderConfig, stream) {
        return new ReadableStream({
            start: async (controller) => {
                const decoder = new VideoDecoder({
                    /** @param {VideoFrame} frame */
                    output(frame) {
                        controller.enqueue(frame)
                    },
                    error(e) {
                        console.error('error at mp4Decoder', e)
                        controller.error(e)
                    }
                })

                return this.#mp4Demuxer.run(stream,
                    {
                        onConfig(config) {
                            decoder.configure(config)
                        },
                        /** @param {EncodedVideoChunk} chunk */
                        onChunk(chunk) {
                            decoder.decode(chunk)
                        },
                    }
                ).then(() => {
                    setTimeout(() => {
                        controller.close()
                    }, 1000);
                })
            },

        })

    }
    async start({ file, encoderConfig, renderFrame }) {
        const stream = file.stream()
        const fileName = file.name.split('/').pop().replace('.mp4', '')
        await this.mp4Decoder(encoderConfig, stream)
            .pipeTo(new WritableStream({
                write(frame) {
                    renderFrame(frame)
                },
            }))
    }

}