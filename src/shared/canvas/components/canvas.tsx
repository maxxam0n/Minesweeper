import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { Layer, Layers, LayerShapes, ShapeDrawingData } from '../lib/types'
import { findDirtyShapes } from '../lib/find-dirty-shapes'
import { LayerRegistryContext } from '../model/layer-registry-context'
import { ShapeRegistryContext } from '../model/shape-registry-context'
import { MetricsProvider } from '../model/metricts-provider'

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

	const animationFrameId = useRef<number>()

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

	const requestDrawLayer = useCallback(
		(layer: Layer) => {
			initializeLayer(layer.canvas, layer.ctx)
			layer.dirtyAreas = [{ x: 0, y: 0, width, height }]
		},
		[initializeLayer]
	)

	useEffect(() => {
		layers.current.forEach(requestDrawLayer)
	}, [width, height, requestDrawLayer])

	const drawShapes = (
		ctx: CanvasRenderingContext2D,
		shapes: LayerShapes,
		opacity: number
	) => {
		const sortedShapes = Array.from(shapes.values()).sort(
			(a, b) => (a.shapeParams.zIndex || 0) - (b.shapeParams.zIndex || 0)
		)
		sortedShapes.forEach(({ draw, shapeParams }) => {
			ctx.save()
			const summaryOpacity = opacity + shapeParams.opacity
			ctx.globalAlpha = Math.max(1 - summaryOpacity, 0)
			draw(ctx)
			ctx.restore()
		})
	}

	// --- Главный цикл отрисовки ---
	useEffect(() => {
		const redrawLoop = () => {
			animationFrameId.current = requestAnimationFrame(redrawLoop)

			layers.current.forEach(layer => {
				const { dirtyAreas, shapes, ctx, opacity } = layer
				if (shapes.size > 0 && dirtyAreas.length > 0) {
					// Пока что отрубил мод отрисовки грязных областей.
					// Сейчас он работает не стабильно.
					// Задетые фигуры рисуются с правильным z-index,
					// но они в свою очередь могут закрывать другие фигуры, у которых z-индекс больше,
					// но которые не попали в грязную область
					// Так же не корректно работает с прозрачными слоями
					if (true) {
						ctx.clearRect(0, 0, width, height)
						drawShapes(ctx, shapes, opacity)
					} else {
						dirtyAreas.forEach(area => {
							ctx.clearRect(area.x, area.y, area.width, area.height)
						})
						const shapesToRedraw = findDirtyShapes(shapes, dirtyAreas)
						drawShapes(layer.ctx, shapesToRedraw, layer.opacity)
					}
				}
				layer.dirtyAreas = []
			})
		}

		redrawLoop()

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [width, height])

	const setShape = useCallback((shapeData: ShapeDrawingData) => {
		const { id, layerName, shapeParams } = shapeData

		layers.current.forEach((layer, key) => {
			if (layer.shapes.has(id) && layerName !== key) {
				layer.shapes.delete(id)
				layer.dirtyAreas.push(shapeParams.box)
			}
			if (layerName === key) {
				layer.shapes.set(id, shapeData)
				layer.dirtyAreas.push(shapeParams.box)
			}
		})
	}, [])

	const removeShape = useCallback((shapeData: ShapeDrawingData) => {
		const { id, layerName, shapeParams } = shapeData

		const layer = layers.current.get(layerName)
		if (layer) {
			layer.shapes.delete(id)
			layer.dirtyAreas.push(shapeParams.box)
		}
	}, [])

	const contextValue = useMemo(
		() => ({ setShape, removeShape }),
		[setShape, removeShape]
	)

	const registerLayer = useCallback(
		(name: string, canvas: HTMLCanvasElement, opacity: number = 0) => {
			if (layers.current.has(name)) return

			const ctx = canvas.getContext('2d')
			if (!ctx) {
				console.error(`Невозможно зарегестрировать слой ${name}`)
				return
			}
			const layer = {
				canvas,
				ctx,
				dirtyAreas: [],
				opacity,
				shapes: new Map(),
			}
			layers.current.set(name, layer)
			requestDrawLayer(layer)
		},
		[requestDrawLayer]
	)

	const unregisterLayer = useCallback((name: string) => {
		layers.current.delete(name)
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
		<MetricsProvider>
			<LayerRegistryContext.Provider value={layerRegistryValue}>
				<ShapeRegistryContext.Provider value={contextValue}>
					<div className="relative" style={containerStyle}>
						{children}
					</div>
				</ShapeRegistryContext.Provider>
			</LayerRegistryContext.Provider>
		</MetricsProvider>
	)
}
