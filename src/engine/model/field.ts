import { createGrid, random } from '../lib/utils'
import { CellModel } from './cell'
import { Cell, Field, GameParams, GameStatus, Position } from './types'

export class FieldModel implements Field {
	public readonly params: GameParams
	public data: Cell[][]
	public isMined: boolean

	constructor(
		params: GameParams,
		data: Cell[][] = this.createEmptyField(params)
	) {
		this.params = params
		this.data = data
		this.isMined = data.some(row => row.some(cell => cell.isMine))
	}

	public placeMines(safeCell: Position) {
		if (this.isMined) return

		this.isMined = true
		const { cols, rows, mines } = this.params
		const avoidSet = new Set()
		avoidSet.add(this.getPositionHash(safeCell))

		let minesPlacedCount = 0
		while (minesPlacedCount < mines) {
			const position = { x: random(cols), y: random(rows) }
			const hash = this.getPositionHash(position)

			if (!avoidSet.has(hash)) {
				avoidSet.add(hash)
				this.getCell(position).mine()
				minesPlacedCount += 1
			}
		}
	}

	public getAreaToReveal(target: Position): Position[] {
		const { cols, rows } = this.params

		const targetCell = this.getCell(target)
		if (!targetCell.isEmpty || targetCell.isMine) return [target]

		const result: Position[] = []
		const queue: Position[] = [target]
		const visited: boolean[][] = createGrid(rows, cols, () => false)

		while (queue.length > 0) {
			const pos = queue.shift()!
			if (visited[pos.y][pos.x]) continue
			if (this.getCell(pos).isEmpty) {
				const siblings = this.getSiblings(pos)
				queue.push(...siblings)
			}

			visited[pos.y][pos.x] = true
			result.push(pos)
		}

		return result
	}

	public getDrawingData(status: GameStatus) {
		return this.data.map(row => row.map(cell => cell.getDrawingData(status)))
	}

	private createEmptyField({ cols, rows }: GameParams) {
		return createGrid(
			rows,
			cols,
			({ col: x, row: y }) => new CellModel(this, { x, y })
		)
	}

	private getPositionHash(position: Position): string {
		return `${position.y}${position.x}`
	}

	private isInBoundary({ x, y }: Position): boolean {
		return x >= 0 && y >= 0 && x < this.params.cols && y < this.params.rows
	}

	/* ======= Вспомогательные методы ======= */
	public getCell({ x, y }: Position): Cell {
		return this.data[y][x]
	}

	public getSiblings({ x, y }: Position): Position[] {
		const siblings: Position[] = []
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) continue
				const position = { x: x + dx, y: y + dy }
				if (this.isInBoundary(position)) {
					siblings.push(position)
				}
			}
		}
		return siblings
	}
}
