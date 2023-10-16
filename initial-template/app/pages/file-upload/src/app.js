import Clock from './deps/clock.js';

const fileUpload = document.getElementById('fileUpload')
const btnUploadVideo = document.getElementById('btnUploadVideos')
const fileSize = document.getElementById('fileSize')
const fileInfo = document.getElementById('fileInfo')
const txtfileName = document.getElementById('fileName')
const fileUploadWrapper = document.getElementById('fileUploadWrapper')
const elapsed = document.getElementById('elapsed')


fileUpload.addEventListener('change', onChange)
btnUploadVideo.addEventListener('click', () => {
    // trigger file input
    fileUpload.click()
})
let took = ''

function parseBytesIntoMBAndGB(bytes) {
    const mb = bytes / (1024 * 1024)
    // if mb is greater than 1024, then convert to GB
    if (mb > 1024) {
        // rount to 2 decimal places
        return `${Math.round(mb / 1024)}GB`
    }
    return `${Math.round(mb)}MB`
}
const clock = new Clock()

function onChange(e) {
    const file = e.target.files[0]
    const { name, size } = file
    txtfileName.innerText = name
    fileSize.innerText = parseBytesIntoMBAndGB(size)

    fileInfo.classList.remove('hide')
    fileUploadWrapper.classList.add('hide')

    clock.start((time) => {
        took = time;
        elapsed.innerText = `Process started ${time}`
    })

    setTimeout(() => {
        clock.stop()
        elapsed.innerText = `Process took ${took.replace('ago', '')}`
    }, 5000)
}