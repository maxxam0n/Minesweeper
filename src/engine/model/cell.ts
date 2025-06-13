import {
	Cell,
	CellDrawingData,
	CellDrawingView,
	Field,
	GameStatus,
	Position,
} from './types'

export class CellModel implements Cell {
	private field: Field
	public readonly key: string
	public readonly position: Position
	public isMine: boolean
	public isRevealed: boolean
	public isFlagged: boolean
	public adjacentMines: number

	constructor(field: Field, position: Position) {
		this.key = this.createKey(position)
		this.position = position
		this.field = field
		this.isMine = false
		this.isRevealed = false
		this.isFlagged = false
		this.adjacentMines = 0
	}

	private createKey({ x, y }: Position) {
		return `${x}-${y}`
	}

	public mine() {
		this.isMine = true
		this.field.getSiblings(this.position).forEach(pos => {
			const sibling = this.field.getCell(pos)
			sibling.adjacentMines += 1
		})
	}

	public open() {
		let unflaggedInAction = 0
		let revealedInAction = 0
		const area = this.field.getAreaToReveal(this.position)
		area.forEach(areaPos => {
			const cellToProcess = this.field.getCell(areaPos)
			if (cellToProcess.isFlagged && !cellToProcess.isMine) {
				cellToProcess.isFlagged = false
				unflaggedInAction += 1
			} else if (!cellToProcess.isRevealed) {
				revealedInAction += 1
				cellToProcess.isRevealed = true
			}
		})
		return { revealedInAction, unflaggedInAction }
	}

	public get isEmpty() {
		return !this.isMine && this.adjacentMines === 0
	}

	public getDrawingData(status: GameStatus): CellDrawingData {
		return { ...this, view: this.getView(status) }
	}

	private getView(status: GameStatus): CellDrawingView {
		switch (true) {
			case this.isMine && this.isRevealed && status === GameStatus.Lost:
				return CellDrawingView.Exploded
			case this.isEmpty && this.isRevealed:
				return CellDrawingView.Empty
			case this.isMine && status === GameStatus.Lost:
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
