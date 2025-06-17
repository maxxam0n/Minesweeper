import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface CircleProps {
	cx: number
	cy: number
	radius: number
	opacity?: number
	fillColor?: string
	strokeColor?: string
	lineWidth?: number
	zIndex?: number
}

export const CircleShape = ({
	cx,
	cy,
	radius,
	strokeColor,
	opacity = 0,
	fillColor = 'white',
	lineWidth = 1,
	zIndex = 0,
}: CircleProps) => {
	const deps = [cx, cy, radius, fillColor, strokeColor, lineWidth]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		ctx.beginPath()
		ctx.arc(cx, cy, radius, 0, Math.PI * 2)
		ctx.fillStyle = fillColor
		ctx.fill()

		if (strokeColor && lineWidth > 0) {
			ctx.strokeStyle = strokeColor
			ctx.lineWidth = lineWidth
			ctx.stroke()
		}
	}, deps)

	const clear = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			const margin = (lineWidth || 0) > 0 ? 1 : 0
			const diameter = radius * 2 + margin * 2
			const x = cx - radius - margin
			const y = cy - radius - margin

			ctx.clearRect(x, y, diameter, diameter)
		},
		[cx, cy, radius, lineWidth]
	)

	useShape(draw, clear, { zIndex, opacity }, deps)

	return null
}
