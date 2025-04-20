import { TPosition } from './types'

export class CellModel {
	public readonly key: string
	public readonly position: TPosition
	public isMined: boolean
	public isRevealed: boolean
	public minesAround: number
	public isFlagged: boolean

	constructor(position: TPosition) {
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
}
