import { PropsWithChildren, useEffect, useRef, useCallback } from 'react'
import { CanvasContext } from '../model/canvas-context'
import { SetShape, ShapeDrawingData, RemoveShape } from '../lib/types'

interface CanvasProps extends PropsWithChildren {
	width?: number
	height?: number
	bgColor?: string
}

type Shapes = Map<string, ShapeDrawingData>

export const Canvas = ({
	children,
	height = 300,
	width = 500,
	bgColor = 'white',
}: CanvasProps) => {
	const canvas = useRef<HTMLCanvasElement | null>(null)
	const context = useRef<CanvasRenderingContext2D | null>(null)
	const shapes = useRef<Shapes>(new Map())
	const isRedrawNeeded = useRef(true)
	const animationFrameId = useRef<number>()

	// --- Инициализация Canvas ---
	useEffect(() => {
		if (canvas.current instanceof HTMLCanvasElement) {
			const ctx = canvas.current.getContext('2d')
			if (!ctx) throw new Error('Не удалось получить 2D контекст для canvas')

			context.current = ctx

			const dpr = window.devicePixelRatio || 1
			const logicalWidth = width
			const logicalHeight = height

			canvas.current.width = logicalWidth * dpr
			canvas.current.height = logicalHeight * dpr
			canvas.current.style.width = `${logicalWidth}px`
			canvas.current.style.height = `${logicalHeight}px`

			ctx.scale(dpr, dpr)

			isRedrawNeeded.current = true
		}
	}, [width, height])

	const drawShapes = useCallback(() => {
		if (!context.current) return

		const sortedShapes = Array.from(shapes.current.values()).sort(
			(a, b) => (a.shapeParams.zIndex || 0) - (b.shapeParams.zIndex || 0)
		)

		sortedShapes.forEach(shape => {
			if (shape.draw) {
				context.current!.save()
				shape.draw(context.current!)
				context.current!.restore()
			}
		})
	}, [])

	// --- Главный цикл отрисовки ---
	useEffect(() => {
		const redrawLoop = () => {
			animationFrameId.current = requestAnimationFrame(redrawLoop)

			if (isRedrawNeeded.current && context.current && canvas.current) {
				isRedrawNeeded.current = false

				context.current.fillStyle = bgColor
				context.current.fillRect(0, 0, width, height)

				drawShapes()
			}
		}

		redrawLoop()

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [bgColor, drawShapes, width, height])

	const setShape: SetShape = (shapeData: ShapeDrawingData) => {
		shapes.current.set(shapeData.id, shapeData)
		isRedrawNeeded.current = true
	}

	const removeShape: RemoveShape = (shapeData: ShapeDrawingData) => {
		shapes.current.delete(shapeData.id)
		isRedrawNeeded.current = true
	}

	return (
		<CanvasContext.Provider value={{ setShape, removeShape }}>
			{children}
			<canvas ref={canvas} width={width} height={height} />
		</CanvasContext.Provider>
	)
}
