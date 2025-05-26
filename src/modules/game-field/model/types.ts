export type Position = {
	x: number
	y: number
}

export type FieldType = 'classic' | 'honeycomb'

export type FieldParams = {
	cols: number
	rows: number
	mines: number
	type: FieldType
}

export enum FieldColorsEnum {
	CLOSED = 'CLOSED',
	REVEALED = 'REVEALED',
	BORDER = 'BORDER',
	EXPLODED = 'EXPLODED',
	EXPLODED_BORDER = 'EXPLODED_BORDER',
	MISSED = 'MISSED',
	LIGHT_BEVEL = 'LIGHT_BEVEL',
	DARK_BEVEL = 'DARK_BEVEL',
	MINE = 'MINE',
	FLAG = 'FLAG',
	FLAG_SHAFT = 'FLAG_SHAFT',
	NUMBER_1 = '1',
	NUMBER_2 = '2',
	NUMBER_3 = '3',
	NUMBER_4 = '4',
	NUMBER_5 = '5',
	NUMBER_6 = '6',
	NUMBER_7 = '7',
	NUMBER_8 = '8',
}

export type FieldColors = Record<FieldColorsEnum, string>

export interface Cell {
	readonly key: string
	readonly position: Position
	isMined: boolean
	isRevealed: boolean
	minesAround: number
	isFlagged: boolean
	readonly isEmpty: boolean
	openImmutable: () => Cell
	markImmutable: (draw: boolean) => Cell
}

export interface Field {
	field: Cell[][]
	isMinesPlaced: boolean
	needToOpen: number
	readonly params: FieldParams
	placeMines(safeCell: Position): Field
	getAreaToReveal(target: Position): Position[]
	openCellImmutable(pos: Position): Field
	markCellImmutable(pos: Position, draw: boolean): Field
	getCell(position: Position): Cell
	getSiblings(position: Position): Position[]
}
