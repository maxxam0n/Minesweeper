import { createGrid } from '@/shared/utils/createGrid'
import { getRandomNumber } from '@/shared/utils/getRundomNumber'
import { CellModel } from './CellModel'
import { Field, FieldParams, Position } from './types'

export class FieldModel implements Field {
	public field: CellModel[][]
	public isMinesPlaced: boolean
	public needToOpen: number
	public readonly params: FieldParams

	constructor(
		params: FieldParams,
		isMinesPlaced: boolean = false,
		field: CellModel[][] = this.createEmptyField(params)
	) {
		this.params = params
		this.needToOpen = params.cols * params.rows - params.mines
		this.field = field
		this.isMinesPlaced = isMinesPlaced
	}

	public placeMines(safeCell: Position): FieldModel {
		if (this.isMinesPlaced) return this

		const { cols, rows } = this.params
		const avoidSet = new Set()
		avoidSet.add(this.getPositionHash(safeCell))
		const field = this.createEmptyField(this.params)

		let minesPlacedCount = 0
		while (minesPlacedCount < this.params.mines) {
			const position = { x: getRandomNumber(cols), y: getRandomNumber(rows) }
			const hash = this.getPositionHash(position)

			if (!avoidSet.has(hash)) {
				avoidSet.add(hash)
				field[position.y][position.x].isMined = true
				minesPlacedCount += 1
				this.getSiblings(position).forEach(pos => {
					field[pos.y][pos.x].minesAround += 1
				})
			}
		}

		return new FieldModel(this.params, true, field)
	}

	private createEmptyField({ cols, rows }: FieldParams) {
		return createGrid(rows, cols, (y, x) => new CellModel({ x, y }))
	}

	public getAreaToReveal(target: Position): Position[] {
		const { cols, rows } = this.params

		if (!this.getCell(target).isEmpty) return [target]

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

	public openCellImmutable(pos: Position): FieldModel {
		const newCell = this.getCell(pos).openImmutable()
		const newField = this.updateFieldCell(newCell)
		return new FieldModel(this.params, this.isMinesPlaced, newField)
	}

	public markCellImmutable(pos: Position, draw: boolean): FieldModel {
		const newCell = this.getCell(pos).markImmutable(draw)
		const newField = this.updateFieldCell(newCell)
		return new FieldModel(this.params, this.isMinesPlaced, newField)
	}

	/* Вспомогательные методы */
	public getCell({ x, y }: Position): CellModel {
		return this.field[y][x]
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

	private getPositionHash(position: Position): string {
		return `${position.y}${position.x}`
	}

	private isInBoundary({ x, y }: Position): boolean {
		return x >= 0 && y >= 0 && x < this.params.cols && y < this.params.rows
	}

	private updateFieldCell(cell: CellModel): CellModel[][] {
		return this.field.map((row, y) => {
			return y !== cell.position.y
				? row
				: row.map((c, x) => (x === cell.position.x ? cell : c))
		})
	}
}
