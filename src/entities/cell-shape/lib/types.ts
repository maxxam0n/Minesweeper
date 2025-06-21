import { CellDrawingView, Position } from '@/engine'

export interface CellData {
	position: Position
	view: CellDrawingView
	adjacentMines: number
}

export interface BaseCellProps {
	x: number
	y: number
}

export interface EffectProps extends BaseCellProps {
	id: string
	onComplete: (id: string) => void
}
