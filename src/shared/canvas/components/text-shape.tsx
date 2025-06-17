import { useCallback } from 'react'
import { useShape } from '../lib/use-shape'

interface TextProps {
	x: number
	y: number
	text: string | number
	opacity?: number
	font?: string
	textAlign?: 'start' | 'end' | 'left' | 'right' | 'center'
	textBaseline?:
		| 'top'
		| 'hanging'
		| 'middle'
		| 'alphabetic'
		| 'ideographic'
		| 'bottom'
	direction?: 'ltr' | 'rtl' | 'inherit'
	maxWidth?: number
	fillColor?: string
	strokeColor?: string
	lineWidth?: number
	zIndex?: number
}

export const TextShape = ({
	x,
	y,
	text,
	opacity = 0,
	font = 'bold 16px sans-serif',
	textAlign = 'start',
	textBaseline = 'alphabetic',
	direction = 'inherit',
	fillColor = 'transparent',
	strokeColor = 'transparent',
	lineWidth = 0,
	maxWidth,
	zIndex = 0,
}: TextProps) => {
	const deps = [
		x,
		y,
		text,
		font,
		textAlign,
		textBaseline,
		direction,
		fillColor,
		strokeColor,
		lineWidth,
		maxWidth,
	]

	const draw = useCallback((ctx: CanvasRenderingContext2D) => {
		ctx.font = font
		ctx.textAlign = textAlign
		ctx.textBaseline = textBaseline
		ctx.direction = direction

		const textToDraw = String(text)

		// Отрисовка с заливкой
		if (fillColor) {
			ctx.fillStyle = fillColor
			if (maxWidth !== undefined) {
				ctx.fillText(textToDraw, x, y, maxWidth)
			} else {
				ctx.fillText(textToDraw, x, y)
			}
		}

		// Отрисовка с обводкой
		if (strokeColor && lineWidth > 0) {
			ctx.strokeStyle = strokeColor
			ctx.lineWidth = lineWidth
			if (maxWidth !== undefined) {
				ctx.strokeText(textToDraw, x, y, maxWidth)
			} else {
				ctx.strokeText(textToDraw, x, y)
			}
		}
	}, deps)

	const clear = useCallback((ctx: CanvasRenderingContext2D) => {}, [])

	useShape(draw, clear, { zIndex, opacity }, deps)

	return null
}
