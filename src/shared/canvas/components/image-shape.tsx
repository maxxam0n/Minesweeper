import { useCallback, useEffect, useState } from 'react'
import { useShape } from '../lib/use-shape'
import { Layer } from '../lib/types'

interface ImageShapeProps {
	src: string
	x: number
	y: number
	layer?: Layer
	width?: number
	height?: number
	zIndex?: number
}

type ImageStatus = 'loading' | 'loaded' | 'error'

export const ImageShape = ({
	src,
	x,
	y,
	width,
	layer = 'dynamic',
	height,
	zIndex = 0,
}: ImageShapeProps) => {
	const [image, setImage] = useState<HTMLImageElement | null>(null)
	const [status, setStatus] = useState<ImageStatus>('loading')

	useEffect(() => {
		if (!src) {
			setStatus('error')
			return
		}

		const img = new Image()
		img.src = src

		const handleLoad = () => {
			setStatus('loaded')
			setImage(img)
		}

		const handleError = () => {
			setStatus('error')
			setImage(null)
			console.error(`Не удалось загрузить изображение по адресу: ${src}`)
		}

		img.addEventListener('load', handleLoad)
		img.addEventListener('error', handleError)

		return () => {
			img.removeEventListener('load', handleLoad)
			img.removeEventListener('error', handleError)
		}
	}, [src])

	const deps = [image, status, x, y, width, height]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		if (status === 'loaded' && image) {
			const w = width ?? image.naturalWidth
			const h = height ?? image.naturalHeight
			ctx.drawImage(image, x, y, w, h)
		}
		// Если статус 'loading' или 'error', ничего не рисуем
	}, deps)

	useShape(draw, { zIndex, layer }, deps)

	return null
}
