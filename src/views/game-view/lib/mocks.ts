import { CellData } from '@/engine'

export const mockField: CellData[][] = [
	[number(0, 0, 3), number(1, 0, 4), number(2, 0, 3)],
	[hidden(0, 1, true), hidden(1, 1), hidden(2, 1, true)],
	[number(0, 2, 2), number(1, 2, 4), number(2, 2, 3)],
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
