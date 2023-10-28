let _canvas
let _ctx
export default class CanvasRenderer {

    /** @param {VideoFrame} frame */
    static draw(frame) {
        const { displayHeight, displayWidth } = frame

        _canvas.width = displayWidth
        _canvas.height = displayHeight
        _ctx.drawImage(
            frame,
            0,
            0,
            displayWidth,
            displayHeight
        )
        frame.close()
    }

    static getRenderer(canvas) {
        const renderer = this
        let pendingFrame = null
        _canvas = canvas
        _ctx = canvas.getContext('2d')

        return frame => {
            const renderAnimationFrame = () => {
                renderer.draw(pendingFrame)
                pendingFrame = null
            }

            if (!pendingFrame) {
                requestAnimationFrame(renderAnimationFrame)
            } else {
                pendingFrame.close()
            }

            pendingFrame = frame;
        }
    }
}