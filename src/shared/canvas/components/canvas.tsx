import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { CanvasContext } from '../model/canvas-context'
import { ShapeDrawingData } from '../lib/types'
import { LayerContext } from '../model/layer-context'

interface CanvasProps extends PropsWithChildren {
	width?: number
	height?: number
	bgColor?: string
}

type Layers = Map<string, HTMLCanvasElement>
type Contexts = Map<string, CanvasRenderingContext2D>
type LayerShapes = Map<string, ShapeDrawingData>
type Shapes = Map<string, LayerShapes>
type Subscribers = Map<string, boolean>

export const Canvas = ({
	children,
	height = 300,
	width = 500,
	bgColor = 'white',
}: CanvasProps) => {
	const layers = useRef<Layers>(new Map())
	const contexts = useRef<Contexts>(new Map())
	const redrawSubscribers = useRef<Subscribers>(new Map())

	const shapes = useRef<Shapes>(new Map())

	const animationFrameId = useRef<number>()

	const initializeCanvas = useCallback(
		(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
			if (canvas instanceof HTMLCanvasElement) {
				const dpr = window.devicePixelRatio || 1
				const logicalWidth = width
				const logicalHeight = height

				canvas.width = logicalWidth * dpr
				canvas.height = logicalHeight * dpr
				canvas.style.width = `${logicalWidth}px`
				canvas.style.height = `${logicalHeight}px`

				context.scale(dpr, dpr)
			}
		},
		[width, height]
	)

	useEffect(() => {
		layers.current.forEach((canvas, name) => {
			const ctx = contexts.current.get(name)
			if (ctx) {
				initializeCanvas(canvas, ctx)
				redrawSubscribers.current.set(name, true)
			}
		})
	}, [width, height, initializeCanvas])

	const drawShapes = (ctx: CanvasRenderingContext2D, shapes: LayerShapes) => {
		const sortedShapes = Array.from(shapes.values()).sort(
			(a, b) => (a.shapeParams.zIndex || 0) - (b.shapeParams.zIndex || 0)
		)

		sortedShapes.forEach(shape => {
			if (shape.draw) {
				ctx!.save()
				const opacity = shape.layerOpacity + shape.shapeParams.opacity
				ctx.globalAlpha = Math.max(1 - opacity, 0)
				shape.draw(ctx!)
				ctx!.restore()
			}
		})
	}

	// --- Главный цикл отрисовки ---
	useEffect(() => {
		const redrawLoop = () => {
			animationFrameId.current = requestAnimationFrame(redrawLoop)

			redrawSubscribers.current.forEach((needRedraw, key, map) => {
				if (needRedraw) {
					map.set(key, false)
					const ctx = contexts.current.get(key)
					const layerShapes = shapes.current.get(key)
					if (ctx && layerShapes) {
						ctx.clearRect(0, 0, width, height)
						drawShapes(ctx, layerShapes)
					}
				}
			})
		}

		redrawLoop()

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [bgColor, width, height])

	const setShape = useCallback((shapeData: ShapeDrawingData) => {
		const { id, layer } = shapeData

		if (!shapes.current.has(layer)) {
			shapes.current.set(layer, new Map())
		}

		shapes.current.forEach((layerShapes, key) => {
			if (layerShapes.has(id) && layer !== key) {
				layerShapes.delete(id)
				redrawSubscribers.current.set(key, true)
			}
			if (layer === key) {
				layerShapes.set(id, shapeData)
				redrawSubscribers.current.set(key, true)
			}
		})
	}, [])

	const removeShape = useCallback((shapeData: ShapeDrawingData) => {
		const { id, layer } = shapeData
		const layerShapes = shapes.current.get(layer)
		if (layerShapes) {
			layerShapes.delete(id)
			redrawSubscribers.current.set(layer, true)
		}
	}, [])

	const contextValue = useMemo(
		() => ({ setShape, removeShape }),
		[setShape, removeShape]
	)

	const registerLayer = useCallback(
		(name: string, canvas: HTMLCanvasElement) => {
			if (layers.current.has(name)) return

			layers.current.set(name, canvas)
			const ctx = canvas.getContext('2d')
			if (ctx) {
				contexts.current.set(name, ctx)
				initializeCanvas(canvas, ctx)
				redrawSubscribers.current.set(name, true)
			}
		},
		[initializeCanvas]
	)

	const unregisterLayer = useCallback((name: string) => {
		layers.current.delete(name)
		contexts.current.delete(name)
		shapes.current.delete(name)
		redrawSubscribers.current.delete(name)
	}, [])

	const layerRegistryValue = useMemo(
		() => ({
			registerLayer,
			unregisterLayer,
		}),
		[registerLayer, unregisterLayer]
	)

	const containerStyle = useMemo(() => {
		return {
			width: `${width}px`,
			height: `${height}px`,
			backgroundColor: bgColor,
		}
	}, [width, height])

	return (
		<CanvasContext.Provider value={contextValue}>
			<LayerContext.Provider value={layerRegistryValue}>
				<div className="relative" style={containerStyle}>
					{children}
				</div>
			</LayerContext.Provider>
		</CanvasContext.Provider>
	)
}
