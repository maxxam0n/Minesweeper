import { CellData } from './types'

export const mockField: CellData[][] = [
	[empty(0, 0), empty(1, 0), empty(2, 0), empty(3, 0), empty(4, 0)],
	[
		empty(0, 1),
		number(1, 1, 2),
		number(2, 1, 2),
		number(3, 1, 2),
		empty(4, 1),
	],
	[
		empty(0, 2),
		hidden(1, 2, true),
		hidden(2, 2, false),
		hidden(3, 2, true),
		empty(4, 2),
	],
	[
		empty(0, 3),
		number(1, 3, 1),
		number(2, 3, 2),
		number(3, 3, 2),
		empty(4, 3),
	],
	[empty(0, 4), empty(1, 4), empty(2, 4), empty(3, 4), empty(4, 4)],
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
