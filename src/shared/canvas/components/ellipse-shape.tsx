import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface EllipseProps {
	cx: number
	cy: number
	radiusX: number
	radiusY: number
	rotation?: number
	fillColor?: string
	strokeColor?: string
	lineWidth?: number
	zIndex?: number
}

export const EllipseShape = ({
	cx,
	cy,
	radiusX,
	radiusY,
	rotation = 0,
	fillColor = 'white',
	strokeColor,
	lineWidth = 1,
	zIndex = 0,
}: EllipseProps) => {
	const deps = [cx, cy, radiusX, radiusY, fillColor, strokeColor, lineWidth]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		ctx.beginPath()
		ctx.ellipse(cx, cy, radiusX, radiusY, rotation, 0, Math.PI * 2)

		if (fillColor) {
			ctx.fillStyle = fillColor
			ctx.fill()
		}
		if (strokeColor && lineWidth > 0) {
			ctx.strokeStyle = strokeColor
			ctx.lineWidth = lineWidth
			ctx.stroke()
		}
	}, deps)

	useShape(draw, { zIndex }, deps)

	return null
}
