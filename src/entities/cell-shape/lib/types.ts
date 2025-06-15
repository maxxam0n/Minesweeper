import { CellDrawingView, Position } from '@/engine'

export interface ViewConfig {
	cellSize: number
	font?: string
	bevelWidth?: number
	borderWidth?: number
}

export interface CellData {
	position: Position
	view: CellDrawingView
	adjacentMines: number
}
