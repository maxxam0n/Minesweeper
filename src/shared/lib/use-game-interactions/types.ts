import { MouseEvent } from 'react'
import { Position } from '@/engine'

export interface GameInteractionsProps {
	gameOver: boolean
	onToggleFlag: (pos: Position) => void
	onCellPress: (pos: Position) => void
	onCellRelease: (isClick: boolean, pos?: Position) => void
	getPositionFromEvent: (event: MouseEvent) => Position | null
}
