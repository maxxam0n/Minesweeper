import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { CanvasContext } from '../model/canvas-context'
import { LayerContext } from '../model/layer-context'
import {
	BoundingBox,
	Contexts,
	DirtyArea,
	Layers,
	LayerShapes,
	ShapeDrawingData,
	Shapes,
} from '../lib/types'
import { findDirtyShapes } from '../lib/find-dirty-shapes'
import { MeasureContext } from '../model/measure-context'

interface CanvasProps extends PropsWithChildren {
	width?: number
	height?: number
	bgColor?: string
}

export const Canvas = ({
	children,
	height = 300,
	width = 500,
	bgColor = 'white',
}: CanvasProps) => {
	const layers = useRef<Layers>(new Map())
	const contexts = useRef<Contexts>(new Map())
	const shapes = useRef<Shapes>(new Map())
	const dirtyArea = useRef<DirtyArea>(new Map())

	const animationFrameId = useRef<number>()
	const measureContextRef = useRef<CanvasRenderingContext2D | null>(null)

	const initializeLayer = useCallback(
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
		const canvas = document.createElement('canvas')
		measureContextRef.current = canvas.getContext('2d')
	}, [])

	const requestDrawLayer = useCallback((layer: string) => {
		dirtyArea.current.set(layer, [{ x: 0, y: 0, width, height }])
	}, [])

	const requestDrawLayerArea = useCallback(
		(layer: string, area: BoundingBox) => {
			const layerAreas = dirtyArea.current.get(layer)
			if (!layerAreas) requestDrawLayer(layer)
			else layerAreas.push(area)
		},
		[requestDrawLayer]
	)

	useEffect(() => {
		layers.current.forEach((canvas, name) => {
			const ctx = contexts.current.get(name)
			if (ctx) {
				initializeLayer(canvas, ctx)
				requestDrawLayer(name)
			}
		})
	}, [width, height, initializeLayer, requestDrawLayer])

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

			dirtyArea.current.forEach((areasToRedraw, layerName, dirtyMap) => {
				if (areasToRedraw.length > 0) {
					dirtyMap.set(layerName, [])
					const ctx = contexts.current.get(layerName)
					const allShapesOnLayer = shapes.current.get(layerName)

					if (ctx && allShapesOnLayer) {
						areasToRedraw.forEach(area => {
							ctx.clearRect(area.x, area.y, area.width, area.height)
						})

						const shapesToRedraw = findDirtyShapes(
							allShapesOnLayer,
							areasToRedraw
						)
						drawShapes(ctx, shapesToRedraw)
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

	const setShape = useCallback(
		(shapeData: ShapeDrawingData) => {
			const { id, layer } = shapeData

			if (!shapes.current.has(layer)) {
				shapes.current.set(layer, new Map())
			}

			shapes.current.forEach((layerShapes, key) => {
				if (layerShapes.has(id) && layer !== key) {
					layerShapes.delete(id)
					requestDrawLayerArea(key, shapeData.shapeParams.box)
				}
				if (layer === key) {
					layerShapes.set(id, shapeData)
					requestDrawLayerArea(layer, shapeData.shapeParams.box)
				}
			})
		},
		[requestDrawLayerArea]
	)

	const removeShape = useCallback(
		(shapeData: ShapeDrawingData) => {
			const { id, layer, shapeParams } = shapeData

			const ctx = contexts.current.get(layer)
			const layerShapes = shapes.current.get(layer)

			if (ctx && layerShapes) {
				layerShapes.delete(id)
				requestDrawLayerArea(layer, shapeParams.box)
			}
		},
		[requestDrawLayerArea]
	)

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
				requestDrawLayer(name)
				initializeLayer(canvas, ctx)
			}
		},
		[initializeLayer, requestDrawLayer]
	)

	const unregisterLayer = useCallback((name: string) => {
		layers.current.delete(name)
		contexts.current.delete(name)
		shapes.current.delete(name)
		dirtyArea.current.delete(name)
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
		<MeasureContext.Provider value={measureContextRef.current}>
			<CanvasContext.Provider value={contextValue}>
				<LayerContext.Provider value={layerRegistryValue}>
					<div className="relative" style={containerStyle}>
						{children}
					</div>
				</LayerContext.Provider>
			</CanvasContext.Provider>
		</MeasureContext.Provider>
	)
}
