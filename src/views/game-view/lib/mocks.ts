import { CellData } from '@/engine'

export const mockField: CellData[][] = [
	[
		empty(0, 0),
		empty(1, 0),
		empty(2, 0),
		empty(3, 0),
		empty(4, 0),
		empty(5, 0),
	],
	[
		empty(0, 1),
		number(1, 1, 1),
		number(2, 1, 2),
		number(3, 1, 2),
		number(4, 1, 1),
		empty(5, 1),
	],
	[
		empty(0, 2),
		hidden(1, 2),
		hidden(2, 2),
		hidden(3, 2),
		hidden(4, 2),
		empty(5, 2),
	],
	[
		empty(0, 3),
		hidden(1, 3),
		hidden(2, 3),
		hidden(3, 3),
		hidden(4, 3),
		empty(5, 3),
	],
	[
		empty(0, 4),
		number(1, 4, 1),
		number(2, 4, 1),
		number(3, 4, 2),
		number(4, 4, 1),
		empty(5, 4),
	],
	[
		empty(0, 5),
		empty(1, 5),
		empty(2, 5),
		empty(3, 5),
		empty(4, 5),
		empty(5, 5),
	],
]

function hidden(col: number, row: number, mine = false): CellData {
	return {
		key: `${col}-${row}`,
		position: { col, row },
		isMine: mine,
		adjacentMines: 0,
		isRevealed: false,
		isFlagged: false,
		isEmpty: false,
		isExploded: false,
		isMissed: false,
		isUntouched: true,
		notFoundMine: true,
	}
}

function number(col: number, row: number, mines: number): CellData {
	return {
		key: `${col}-${row}`,
		position: { col, row },
		isMine: false,
		adjacentMines: mines,
		isRevealed: true,
		isFlagged: false,
		isEmpty: mines === 0,
		isExploded: false,
		isMissed: false,
		isUntouched: false,
		notFoundMine: false,
	}
}

function empty(col: number, row: number): CellData {
	return number(col, row, 0)
}
