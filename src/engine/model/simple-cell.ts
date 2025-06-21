import {
	CellData,
	CellDrawingData,
	CellDrawingView,
	ConstructorCellProps,
	GameStatus,
	Position,
} from './types'

export class SimpleCell implements CellData {
	static createKey({ col, row }: Position) {
		return `${col}-${row}`
	}

	public readonly key: string
	public readonly position: Position
	public isMine: boolean
	public isRevealed: boolean
	public isFlagged: boolean
	public adjacentMines: number

	constructor({
		position,
		adjacentMines = 0,
		isFlagged = false,
		isMine = false,
		isRevealed = false,
	}: ConstructorCellProps) {
		this.key = SimpleCell.createKey(position)
		this.position = position
		this.isMine = isMine
		this.isRevealed = isRevealed
		this.isFlagged = isFlagged
		this.adjacentMines = adjacentMines
	}

	public get isEmpty() {
		return !this.isMine && this.adjacentMines === 0
	}

	public getDrawingData(status: GameStatus): CellDrawingData {
		return {
			data: { ...this, isEmpty: this.isEmpty },
			view: this.getView(status),
		}
	}

	private getView(status: GameStatus): CellDrawingView {
		switch (true) {
			case this.isMine && this.isRevealed && status === GameStatus.Lost:
				return CellDrawingView.Exploded
			case this.isEmpty && this.isRevealed:
				return CellDrawingView.Empty
			case this.isMine && !this.isFlagged && status === GameStatus.Lost:
				return CellDrawingView.Mine
			case this.isFlagged && !this.isMine && status === GameStatus.Lost:
				return CellDrawingView.Missed
			case this.isFlagged:
				return CellDrawingView.Flag
			case this.adjacentMines > 0 && this.isRevealed:
				return CellDrawingView.Digit
			default:
				return CellDrawingView.Closed
		}
	}
}
