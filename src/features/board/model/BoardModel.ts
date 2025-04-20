import { createArray } from '@/shared/lib/createArray'
import { getRandomNumber } from '@/shared/lib/getRundomNumber'
import { CellModel } from './CellModel'
import { TBoardParams, TPosition } from './types'

export class BoardModel {
	public board: CellModel[][]
	public isMinesPlaced: boolean
	public needToOpen: number
	public readonly params: TBoardParams

	constructor(
		params: TBoardParams,
		isMinesPlaced: boolean = false,
		board: CellModel[][] = this.createEmptyBoard(params)
	) {
		this.params = params
		this.needToOpen = params.cols * params.rows - params.mines
		this.board = board
		this.isMinesPlaced = isMinesPlaced
	}

	public placeMines(safeCell: TPosition) {
		if (this.isMinesPlaced) return

		const { cols, rows } = this.params
		const avoidSet = new Set()
		avoidSet.add(this.getPositionHash(safeCell))

		let minesPlacedCount = 0
		while (minesPlacedCount < this.params.mines) {
			const position = { x: getRandomNumber(cols), y: getRandomNumber(rows) }
			const hash = this.getPositionHash(position)

			if (!avoidSet.has(hash)) {
				avoidSet.add(hash)
				this.getCell(position).isMined = true
				this.getSiblingCells(position).forEach(cell => cell.minesAround++)
				minesPlacedCount += 1
			}
		}
		this.isMinesPlaced = true
	}

	private createEmptyBoard({ cols, rows }: TBoardParams) {
		return createArray(rows, i =>
			createArray(cols, j => new CellModel({ x: j, y: i }))
		)
	}

	public getAreaToReveal(target: TPosition): CellModel[] {
		const { cols, rows } = this.params
		const targetCell = this.getCell(target)
		if (!targetCell.isEmpty) return [targetCell]

		const result: CellModel[] = []
		const queue: CellModel[] = [targetCell]
		const visited: boolean[][] = createArray(rows, () => {
			return createArray(cols, () => false)
		})

		while (queue.length > 0) {
			const cell = queue.shift()!
			if (visited[cell.position.y][cell.position.x]) continue
			if (cell.isEmpty) {
				const siblings = this.getSiblingCells(cell.position)
				queue.push(...siblings)
			}

			visited[cell.position.y][cell.position.x] = true
			result.push(cell)
		}

		return result
	}

	/* Вспомогательные методы */
	public getSiblingCells({ x, y }: TPosition): CellModel[] {
		const siblings: TPosition[] = [
			{ x: x - 1, y: y - 1 },
			{ x, y: y - 1 },
			{ x: x + 1, y: y - 1 },
			{ x: x - 1, y },
			{ x: x + 1, y },
			{ x: x - 1, y: y + 1 },
			{ x, y: y + 1 },
			{ x: x + 1, y: y + 1 },
		]

		return siblings
			.filter(position => this.isInBoundary(position))
			.map(position => this.getCell(position))
	}

	private getPositionHash(position: TPosition): string {
		return `${position.y}${position.x}`
	}

	private isInBoundary({ x, y }: TPosition): boolean {
		return x >= 0 && y >= 0 && x < this.params.cols && y < this.params.rows
	}

	public getCell({ x, y }: TPosition) {
		return this.board[y][x]
	}
}
