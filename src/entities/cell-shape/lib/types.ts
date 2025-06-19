import { CellDrawingView, Position } from '@/engine'

export interface CellData {
	position: Position
	view: CellDrawingView
	adjacentMines: number
}
