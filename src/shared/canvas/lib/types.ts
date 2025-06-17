export type LayerRemovalStrategy = 'redraw' | 'clear'

export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ClearFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = { zIndex: number; opacity: number }

export type ShapeDrawingData = {
	draw: DrawFun
	clear: ClearFun
	shapeParams: ShapeParams
	layer: string
	layerOpacity: number
	id: string
}
