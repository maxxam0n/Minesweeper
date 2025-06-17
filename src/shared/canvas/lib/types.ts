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
	layer: string
	layerOpacity: number
	id: string
}

export type Layers = Map<string, HTMLCanvasElement>
export type Contexts = Map<string, CanvasRenderingContext2D>
export type DirtyArea = Map<string, BoundingBox[]>
export type LayerShapes = Map<string, ShapeDrawingData>
export type Shapes = Map<string, LayerShapes>
