import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface LineProps {
	x1: number
	x2: number
	y1: number
	y2: number
	zIndex: number
	opacity?: number
	strokeColor?: string
	lineWidth?: number
}

export const LineShape = ({
	x1,
	x2,
	y1,
	y2,
	zIndex,
	strokeColor,
	opacity = 0,
	lineWidth = 1,
}: LineProps) => {
	const deps = [x1, x2, y1, y2, strokeColor, lineWidth]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		if (!strokeColor || lineWidth <= 0) return

		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.strokeStyle = strokeColor
		ctx.lineWidth = lineWidth
		ctx.stroke()
	}, deps)

	const clear = useCallback((ctx: CanvasRenderingContext2D) => {}, [])

	useShape(draw, clear, { zIndex, opacity }, deps)

	return null
}
