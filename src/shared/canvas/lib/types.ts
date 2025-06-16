export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = { zIndex: number; opacity: number }

export type ShapeDrawingData = {
	draw: DrawFun
	shapeParams: ShapeParams
	layer: string
	layerOpacity: number
	id: string
}
