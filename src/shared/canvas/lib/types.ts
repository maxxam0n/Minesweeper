export type DrawFun = (ctx: CanvasRenderingContext2D) => void

export type ShapeParams = { zIndex: number } & Record<string, unknown>

export type ShapeDrawingData = {
	draw: DrawFun
	shapeParams: ShapeParams
	id: string
}

export type RequestRedraw = (shapeData?: ShapeDrawingData) => void

export type SetShape = (shapeData: ShapeDrawingData) => void

export type RemoveShape = (shapeData: ShapeDrawingData) => void
