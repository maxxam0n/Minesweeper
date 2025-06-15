export type GameParams = {
	cols: number
	rows: number
	mines: number
}

export type Position = {
	x: number
	y: number
}

export type FieldType = 'classic'

export enum GameStatus {
	Idle = 'idle',
	Playing = 'playing',
	Won = 'won',
	Lost = 'lost',
}

export enum CellDrawingView {
	Digit = 'Digit',
	Closed = 'closed',
	Empty = 'empty',
	Mine = 'mine',
	Flag = 'flag',
	Exploded = 'exploded',
	Missed = 'missed',
}

export interface CellDrawingData {
	key: string
	position: Position
	isMine: boolean
	adjacentMines: number
	isRevealed: boolean
	isFlagged: boolean
	view: CellDrawingView
}

export interface Cell {
	readonly key: string
	readonly position: Position
	isMine: boolean
	adjacentMines: number
	isRevealed: boolean
	isFlagged: boolean
	isEmpty: boolean
	mine(): void
	open(): { unflaggedPositions: Position[]; revealedPositions: Position[] }
	getDrawingData(status: GameStatus): CellDrawingData
	clone(newField: Field): Cell
}

export interface Field {
	data: Cell[][]
	isMined: boolean
	readonly params: GameParams
	placeMines(safeCell: Position): void
	getAreaToReveal(target: Position): Position[]
	getCell(position: Position): Cell
	getSiblings(position: Position): Position[]
	getDrawingData(status: GameStatus): CellDrawingData[][]
	createCopy(): Field
}

export interface GameState {
	status: GameStatus
	flagged: number
	drawingData: Readonly<CellDrawingData>[][]
	revealed: number
}

export interface ActionChanges {
	flaggedPositions: Position[]
	unflaggedPositions: Position[]
	revealedPositions: Position[]
	explodedCells: Readonly<Position>[]
}

export type AnimationEvent =
	| { type: 'press'; pos: Position }
	| { type: 'cascade'; positions: Position[] }

export interface ActionResult {
	gameState: GameState
	actionChanges: ActionChanges
	animationEvents: AnimationEvent[]
}
