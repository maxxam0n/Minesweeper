export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = {
	zIndex: number
	opacity: number
	box: BoundingBox
}

export type ShapeDrawingData = {
	draw: DrawFun
	shapeParams: ShapeParams
	id: string
	layerName: string
}

export type LayerShapes = Map<string, ShapeDrawingData>

export interface Layer {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	opacity: number
	shapes: LayerShapes
	dirtyAreas: BoundingBox[]
}

export type Layers = Map<string, Layer>
