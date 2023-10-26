export default class View {
    #fileUpload = document.getElementById('fileUpload')
    #btnUploadVideo = document.getElementById('btnUploadVideos')
    #fileSize = document.getElementById('fileSize')
    #fileInfo = document.getElementById('fileInfo')
    #txtfileName = document.getElementById('fileName')
    #fileUploadWrapper = document.getElementById('fileUploadWrapper')
    #elapsed = document.getElementById('elapsed')
    /** @type {HTMLCanvasElement} */
    #canvas = document.getElementById('preview-144p')

    constructor() {
        this.configureBtnUploadClick()
    }
    getCanvas() {
        return this.#canvas.transferControlToOffscreen()
    }
    parseBytesIntoMBAndGB(bytes) {
        const mb = bytes / (1024 * 1024)
        // if mb is greater than 1024, then convert to GB
        if (mb > 1024) {
            // rount to 2 decimal places
            return `${Math.round(mb / 1024)}GB`
        }
        return `${Math.round(mb)}MB`
    }
    configureBtnUploadClick() {

        this.#btnUploadVideo.addEventListener('click', () => {
            // trigger file input
            this.#fileUpload.click()
        })

    }
    onChange(fn) {
        return e => {

            const file = e.target.files[0]
            const { name, size } = file
            fn(file)

            this.#txtfileName.innerText = name
            this.#fileSize.innerText = this.parseBytesIntoMBAndGB(size)

            this.#fileInfo.classList.remove('hide')
            this.#fileUploadWrapper.classList.add('hide')

        }

    }

    updateElapsedTime(text) {
        this.#elapsed.innerText = text
    }
    configureOnFileChange(fn) {
        this.#fileUpload.addEventListener('change', this.onChange(fn))
    }
}