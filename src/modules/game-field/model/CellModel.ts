import { Cell, Position } from './types'

export class CellModel implements Cell {
	public readonly key: string
	public readonly position: Position
	public isMined: boolean
	public isRevealed: boolean
	public minesAround: number
	public isFlagged: boolean

	constructor(position: Position) {
		this.position = position
		this.isMined = false
		this.isRevealed = false
		this.isFlagged = false
		this.minesAround = 0
		this.key = `${position.y}/${position.x}`
	}

	/* Вокруг клетки отсутствуют мины */
	get isEmpty() {
		return this.minesAround === 0 && !this.isMined
	}

	public openImmutable(): CellModel {
		const newCell = Object.assign(new CellModel(this.position), this)
		newCell.isRevealed = true
		return newCell
	}

	public markImmutable(draw: boolean): CellModel {
		const newCell = Object.assign(new CellModel(this.position), this)
		newCell.isFlagged = draw
		return newCell
	}
}
