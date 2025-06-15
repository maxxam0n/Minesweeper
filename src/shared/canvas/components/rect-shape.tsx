import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'
import { Layer } from '../lib/types'

interface RectProps {
	x: number
	y: number
	width: number
	height: number
	layer?: Layer
	fillColor?: string
	strokeColor?: string
	lineWidth?: number
	zIndex?: number
}

export const RectShape = ({
	x,
	y,
	width,
	height,
	fillColor = 'white',
	layer = 'dynamic',
	strokeColor,
	lineWidth = 1,
	zIndex = 0,
}: RectProps) => {
	const deps = [x, y, width, height, fillColor, strokeColor, lineWidth]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = fillColor
		ctx.fillRect(x, y, width, height)

		if (strokeColor && lineWidth > 0) {
			ctx.strokeStyle = strokeColor
			ctx.lineWidth = lineWidth
			ctx.strokeRect(x, y, width, height)
		}
	}, deps)

	useShape(draw, { zIndex, layer }, deps)

	return null
}
