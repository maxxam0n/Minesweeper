export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = { zIndex: number }

export type ShapeDrawingData = {
	draw: DrawFun
	shapeParams: ShapeParams
	layer: string
	id: string
}
