import { createGrid } from '../lib/utils'
import { CellData, ConstrutorFieldProps, GameStatus, Position } from './types'
import { BaseField } from './base-field'
import { SimpleCell } from './simple-cell'

export class SquareField extends BaseField<SimpleCell> {
	constructor({ params, seed, data }: ConstrutorFieldProps) {
		super({ params, data, seed })
	}

	protected createGrid(data?: CellData[][]) {
		if (data) {
			return data.map(r => r.map(c => new SimpleCell(c)))
		}

		const { cols, rows } = this.params
		return createGrid(rows, cols, position => new SimpleCell({ position }))
	}

	public placeMines() {
		if (this.isMined) return

		this.isMined = true
		const { cols, rows, mines } = this.params
		const avoidSet = new Set()

		let minesPlacedCount = 0
		while (minesPlacedCount < mines) {
			const position = {
				col: Math.floor(this.rng() * cols),
				row: Math.floor(this.rng() * rows),
			}
			const hash = SimpleCell.createKey(position)

			if (!avoidSet.has(hash)) {
				avoidSet.add(hash)
				this.mineCell(position)
				minesPlacedCount += 1
			}
		}
	}

	public relocateMine(from: Position, to: Position) {
		this.unMineCell(from)
		this.mineCell(to)
	}

	/* ------------- Вспомогательные методы ------------- */
	private mineCell(position: Position) {
		this.getCell(position).isMine = true
		this.getSiblings(position).forEach(
			sibPos => this.getCell(sibPos).adjacentMines++
		)
	}

	private unMineCell(position: Position) {
		this.getCell(position).isMine = false
		this.getSiblings(position).forEach(
			sibPos => this.getCell(sibPos).adjacentMines--
		)
	}

	private isInBoundary({ row, col }: Position): boolean {
		return (
			col >= 0 &&
			row >= 0 &&
			col < this.params.cols &&
			row < this.params.rows
		)
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
			if (visited[pos.row][pos.col]) continue
			if (this.getCell(pos).isEmpty) {
				const siblings = this.getSiblings(pos)
				queue.push(...siblings)
			}

			visited[pos.row][pos.col] = true
			result.push(pos)
		}

		return result
	}

	public getCell({ row, col }: Position) {
		return this.grid[row][col]
	}

	public getSiblings({ row, col }: Position): Position[] {
		const siblings: Position[] = []
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) continue
				const position = { col: col + dx, row: row + dy }
				if (this.isInBoundary(position)) {
					siblings.push(position)
				}
			}
		}
		return siblings
	}

	public getDrawingData(status: GameStatus) {
		return this.grid.map(row => row.map(cell => cell.getDrawingData(status)))
	}

	public cloneSelf() {
		return new SquareField({
			params: this.params,
			seed: this.seed,
			data: this.grid,
		})
	}
}
