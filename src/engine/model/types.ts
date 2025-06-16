export type GameParams = {
	cols: number
	rows: number
	mines: number
}

export type Position = {
	col: number
	row: number
}

export type FieldType = 'square'

export enum GameStatus {
	Idle = 'idle',
	Playing = 'playing',
	Won = 'won',
	Lost = 'lost',
}

export type GameMode = 'no-guessing' | 'guessing'

export enum CellDrawingView {
	Digit = 'Digit',
	Closed = 'closed',
	Empty = 'empty',
	Mine = 'mine',
	Flag = 'flag',
	Exploded = 'exploded',
	Missed = 'missed',
}

export interface CellData {
	key: string
	position: Position
	isMine: boolean
	adjacentMines: number
	isRevealed: boolean
	isFlagged: boolean
	isEmpty: boolean
}

export interface CellDrawingData {
	data: CellData
	view: CellDrawingView
}

export interface ConstructorCellProps extends Partial<CellData> {
	position: Position
}

export interface ConstrutorFieldProps {
	params: GameParams
	seed?: string
	data?: CellData[][]
}

export interface GameSnapshot {
	status: GameStatus
	flagged: number
	drawingData: CellDrawingData[][]
	revealed: number
}

export interface ActionChanges {
	flaggedPositions: Position[]
	unflaggedPositions: Position[]
	revealedPositions: Position[]
	explodedCells: Position[]
}

export type AnimationEvent = {}

export interface ActionResult {
	gameSnapshot: GameSnapshot
	animationEvents: AnimationEvent[]
	actionChanges: ActionChanges
}
