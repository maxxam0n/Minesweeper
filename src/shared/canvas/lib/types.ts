export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ClearFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = {
	zIndex: number
	opacity: number
	box: BoundingBox
}

export type ShapeDrawingData = {
	draw: DrawFun
	clear: ClearFun
	shapeParams: ShapeParams
	layer: string
	layerOpacity: number
	id: string
}
