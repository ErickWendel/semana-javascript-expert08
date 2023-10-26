import Clock from './deps/clock.js'
import View from './view.js'

const view = new View
const clock = new Clock

const worker = new Worker('./src/worker/worker.js', { type: 'module' })

let took = ''

worker.onerror = error => {
	console.error('erro worker', error)
}

worker.onmessage = ({ data }) => {
	if (data.status !== 'done') return

	clock.stop()
	view.updateElapsedTime(`Process took ${took.replace('ago', '')}`)
}

view.configureOnFileChange((file) => {
	const canvas = view.getCanvas()

	worker.postMessage({ file, canvas }, [ canvas ])

	clock.start((time) => {
		took = time
		view.updateElapsedTime(`Process started ${time}`)
	})
})


/**
 * @internal Function we make to generate a fake pick of file. It is usefull for debugging.
 */
async function fakeFetch() {
	const filePath = '/videos/frag_bunny.mp4'
	const response = await fetch(filePath)

	//-- get file size:
	//	 const response = await fetch(filePath, {
	//		 method: 'HEAD',
	//	 })
	//	response.headers.get('content-length')

	const file = new File([ await response.blob() ], filePath, {
		type: 'video/mp4',
		lastModified: Date.now()
	})

	const event = new Event('change')

	Reflect.defineProperty(event, 'target', {
		value: {
			files: [ file ]
		}
	})

	document.getElementById('fileUpload').dispatchEvent(event)
}

fakeFetch()
