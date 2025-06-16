import {
	Cell,
	CellDrawingData,
	CellDrawingView,
	Field,
	GameStatus,
	Position,
} from './types'

export class CellModel implements Cell {
	static createFromData(
		field: Field,
		data: {
			position: Position
			isMine: boolean
			isRevealed: boolean
			isFlagged: boolean
			adjacentMines: number
		}
	): Cell {
		const newCell = new CellModel(field, data.position)

		newCell.isMine = data.isMine
		newCell.isRevealed = data.isRevealed
		newCell.isFlagged = data.isFlagged
		newCell.adjacentMines = data.adjacentMines

		return newCell
	}

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

	public unMine() {
		this.isMine = false
		this.field.getSiblings(this.position).forEach(pos => {
			const sibling = this.field.getCell(pos)
			sibling.adjacentMines -= 1
		})
	}

	public get isEmpty() {
		return !this.isMine && this.adjacentMines === 0
	}

	public getDrawingData(status: GameStatus): CellDrawingData {
		return { ...this, view: this.getView(status) }
	}

	public clone(newField: Field): Cell {
		return CellModel.createFromData(newField, {
			position: this.position,
			isMine: this.isMine,
			isRevealed: this.isRevealed,
			isFlagged: this.isFlagged,
			adjacentMines: this.adjacentMines,
		})
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
