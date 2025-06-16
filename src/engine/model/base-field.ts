import {
	CellData,
	CellDrawingData,
	ConstrutorFieldProps,
	GameParams,
	GameStatus,
	Position,
} from './types'

export abstract class BaseField<T extends CellData> {
	readonly params: GameParams

	public grid: T[][]
	public isMined: boolean

	constructor({ params, data }: ConstrutorFieldProps) {
		this.params = params
		this.grid = this.createGrid(data)
		this.isMined = this.grid.some(row => row.some(cell => cell.isMine))
	}

	public getCell(pos: Position): T {
		return this.grid[pos.row][pos.col]
	}

	protected abstract createGrid(data?: CellData[][]): T[][]

	// Основные методы поля
	public abstract placeMines(pos: Position): void
	public abstract relocateMine(from: Position, to: Position): void

	// Вспомогательные методы
	public abstract getAreaToReveal(pos: Position): Position[]
	public abstract getSiblings(pos: Position): Position[]
	public abstract getDrawingData(status: GameStatus): CellDrawingData[][]
}
