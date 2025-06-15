import seedrandom from 'seedrandom'
import { createGrid } from '../lib/utils'
import { CellModel } from './cell'
import {
	Cell,
	CellDrawingData,
	Field,
	GameParams,
	GameStatus,
	Position,
} from './types'

interface ConstrutorProps {
	params: GameParams
	seed?: string
	data?: CellDrawingData[][]
}

export class FieldModel implements Field {
	// --------- Методы класса -------------
	static getPositionHash(position: Position): string {
		return `${position.y}${position.x}`
	}

	private static createEmptyGrid(field: Field) {
		const createCell = ({ col: x, row: y }: { col: number; row: number }) => {
			return new CellModel(field, { x, y })
		}

		return createGrid(field.params.rows, field.params.cols, createCell)
	}

	private static createGridFromData(field: Field, data: CellDrawingData[][]) {
		return data.map(row =>
			row.map(cell => CellModel.createFromData(field, cell))
		)
	}

	// -------------------------------------
	public readonly params: GameParams
	public grid: Cell[][]
	public isMined: boolean

	private rng: () => number
	private seed?: string

	constructor({ params, seed, data }: ConstrutorProps) {
		this.params = params
		this.isMined = false
		this.seed = seed
		this.rng = seedrandom(seed)

		if (data) {
			this.grid = FieldModel.createGridFromData(this, data)
			this.isMined = this.grid.some(row => row.some(cell => cell.isMine))
		} else {
			this.grid = FieldModel.createEmptyGrid(this)
		}
	}

	public placeMines(safeCell: Position) {
		if (this.isMined) return

		this.isMined = true
		const { cols, rows, mines } = this.params
		const avoidSet = new Set()
		avoidSet.add(FieldModel.getPositionHash(safeCell))

		let minesPlacedCount = 0
		while (minesPlacedCount < mines) {
			const position = {
				x: Math.floor(this.rng() * cols),
				y: Math.floor(this.rng() * rows),
			}
			const hash = FieldModel.getPositionHash(position)

			if (!avoidSet.has(hash)) {
				avoidSet.add(hash)
				this.getCell(position).mine()
				minesPlacedCount += 1
			}
		}
	}

	public relocateMine(from: Position, to: Position) {
		this.getCell(from).unMine()
		this.getCell(to).mine()
	}

	/* ------------- Вспомогательные методы ------------- */
	public isInBoundary({ x, y }: Position): boolean {
		return x >= 0 && y >= 0 && x < this.params.cols && y < this.params.rows
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

	public getCell({ x, y }: Position): Cell {
		return this.grid[y][x]
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

	public getDrawingData(status: GameStatus) {
		return this.grid.map(row => row.map(cell => cell.getDrawingData(status)))
	}

	public createCopy(): Field {
		const newField = new FieldModel({ params: this.params, seed: this.seed })

		const newGrid = this.grid.map(row =>
			row.map(cell => cell.clone(newField))
		)

		newField.grid = newGrid
		newField.isMined = this.isMined

		return newField
	}
}
