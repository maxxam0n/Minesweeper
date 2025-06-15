import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
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
	const staticCanvas = useRef<HTMLCanvasElement | null>(null)
	const dynamicCanvas = useRef<HTMLCanvasElement | null>(null)

	const staticContext = useRef<CanvasRenderingContext2D | null>(null)
	const dynamicContext = useRef<CanvasRenderingContext2D | null>(null)

	const staticShapes = useRef<Shapes>(new Map())
	const dynamicShapes = useRef<Shapes>(new Map())

	const isStaticRedrawNeeded = useRef(true)
	const isDynamicRedrawNeeded = useRef(true)

	const animationFrameId = useRef<number>()

	// --- Инициализация Canvas ---
	useEffect(() => {
		const initializeCanvas = (
			canvas: HTMLCanvasElement | null,
			context: React.MutableRefObject<CanvasRenderingContext2D | null>
		) => {
			if (canvas instanceof HTMLCanvasElement) {
				const ctx = canvas.getContext('2d')
				if (!ctx)
					throw new Error('Не удалось получить 2D контекст для canvas')

				context.current = ctx

				const dpr = window.devicePixelRatio || 1
				const logicalWidth = width
				const logicalHeight = height

				canvas.width = logicalWidth * dpr
				canvas.height = logicalHeight * dpr
				canvas.style.width = `${logicalWidth}px`
				canvas.style.height = `${logicalHeight}px`

				ctx.scale(dpr, dpr)
			}

			// При изменении размера перерисовываем оба слоя
			isStaticRedrawNeeded.current = true
			isDynamicRedrawNeeded.current = true
		}

		initializeCanvas(staticCanvas.current, staticContext)
		initializeCanvas(dynamicCanvas.current, dynamicContext)
	}, [width, height])

	const drawShapes = (ctx: CanvasRenderingContext2D, shapes: Shapes) => {
		const sortedShapes = Array.from(shapes.values()).sort(
			(a, b) => (a.shapeParams.zIndex || 0) - (b.shapeParams.zIndex || 0)
		)

		sortedShapes.forEach(shape => {
			if (shape.draw) {
				ctx!.save()
				shape.draw(ctx!)
				ctx!.restore()
			}
		})
	}

	// --- Главный цикл отрисовки ---
	useEffect(() => {
		const redrawLoop = () => {
			animationFrameId.current = requestAnimationFrame(redrawLoop)

			if (isStaticRedrawNeeded.current || isDynamicRedrawNeeded.current) {
				console.log(
					isStaticRedrawNeeded.current,
					isDynamicRedrawNeeded.current
				)
			}
			// Перерисовка статичного слоя
			if (isStaticRedrawNeeded.current && staticContext.current) {
				isStaticRedrawNeeded.current = false

				const ctx = staticContext.current
				ctx.clearRect(0, 0, width, height) // Очищаем только статичный слой
				ctx.fillStyle = bgColor // Фон рисуем здесь
				ctx.fillRect(0, 0, width, height)

				// Рисуем все статичные шейпы
				drawShapes(ctx, staticShapes.current)
			}

			// Перерисовка динамичного слоя
			if (isDynamicRedrawNeeded.current && dynamicContext.current) {
				isDynamicRedrawNeeded.current = false

				const ctx = dynamicContext.current
				ctx.clearRect(0, 0, width, height) // Очищаем только динамичный слой

				// Рисуем все динамичные шейпы
				drawShapes(ctx, dynamicShapes.current)
			}
		}

		redrawLoop()

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [bgColor, width, height])

	const setShape: SetShape = useCallback((shapeData: ShapeDrawingData) => {
		console.log('setShape')
		if (shapeData.shapeParams.layer === 'static') {
			if (dynamicShapes.current.has(shapeData.id)) {
				dynamicShapes.current.delete(shapeData.id)
				isDynamicRedrawNeeded.current = true
			}
			staticShapes.current.set(shapeData.id, shapeData)
			isStaticRedrawNeeded.current = true
		} else {
			if (staticShapes.current.has(shapeData.id)) {
				staticShapes.current.delete(shapeData.id)
				isStaticRedrawNeeded.current = true
			}
			dynamicShapes.current.set(shapeData.id, shapeData)
			isDynamicRedrawNeeded.current = true
		}
	}, [])

	const removeShape: RemoveShape = useCallback(
		(shapeData: ShapeDrawingData) => {
			if (shapeData.shapeParams.layer === 'dynamic') {
				dynamicShapes.current.delete(shapeData.id)
				isDynamicRedrawNeeded.current = true
			} else {
				staticShapes.current.delete(shapeData.id)
				isStaticRedrawNeeded.current = true
			}
		},
		[]
	)

	const contextValue = { setShape, removeShape }

	const containerSize = useMemo(() => {
		return {
			width: `${width}px`,
			height: `${height}px`,
		}
	}, [width, height])

	return (
		<CanvasContext.Provider value={contextValue}>
			{children}
			<div className="relative" style={containerSize}>
				<canvas
					className="absolute top-0 left-0"
					ref={staticCanvas}
					width={width}
					height={height}
				/>
				<canvas
					className="absolute top-0 left-0"
					ref={dynamicCanvas}
					width={width}
					height={height}
				/>
			</div>
		</CanvasContext.Provider>
	)
}
