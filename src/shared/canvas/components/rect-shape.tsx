import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface RectProps {
	x: number
	y: number
	width: number
	height: number
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
	strokeColor,
	fillColor = 'white',
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

	useShape(draw, { zIndex }, deps)

	return null
}
