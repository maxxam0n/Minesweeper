export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

export type ShapeRenderer = (ctx: CanvasRenderingContext2D) => void

export type LayerRenderer = (layerData: {
	shapes: LayerShapes
	dirtyAreas: BoundingBox[]
	opacity: number
	ctx: CanvasRenderingContext2D
	drawShapes: (
		ctx: CanvasRenderingContext2D,
		shapes: LayerShapes,
		opacity: number
	) => void
}) => void

export type ShapeParams = {
	zIndex: number
	opacity: number
	box: BoundingBox
}

export type ShapeDrawingData = {
	draw: ShapeRenderer
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
	renderer?: LayerRenderer
}

export type Layers = Map<string, Layer>
