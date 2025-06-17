import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface RectProps {
	x: number
	y: number
	width: number
	height: number
	opacity?: number
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
	opacity = 0,
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

	const clear = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			const margin = (lineWidth || 0) > 0 ? 1 : 0
			ctx.clearRect(
				x - margin,
				y - margin,
				width + margin * 2,
				height + margin * 2
			)
		},
		[x, y, width, height, lineWidth]
	)

	useShape(draw, clear, { zIndex, opacity }, deps)

	return null
}
