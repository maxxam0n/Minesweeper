import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface PolygonProps {
	points: { x: number; y: number }[]
	closed: boolean
	zIndex: number
	fillColor?: string
	strokeColor?: string
	lineWidth?: number
}

export const PolygonShape = ({
	points,
	closed,
	zIndex,
	strokeColor,
	fillColor = 'white',
	lineWidth = 1,
}: PolygonProps) => {
	const deps = [points, closed, fillColor, strokeColor, lineWidth]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		if (!points || points.length < 2) return

		ctx.beginPath()
		ctx.moveTo(points[0].x, points[0].y)

		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y)
		}

		if (closed) {
			ctx.closePath()
		}

		if (fillColor && closed) {
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
