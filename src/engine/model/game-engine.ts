import { FieldFactory } from './field-factory'
import {
	ActionResult,
	AnimationEvent,
	Cell,
	Field,
	FieldType,
	GameParams,
	GameStatus,
	Position,
} from './types'

type MineSweeperConfig = {
	params: GameParams
	seed?: string
	type?: FieldType
	noGuessing?: boolean
}

export class GameEngine {
	private field: Field
	private params: GameParams
	private status: GameStatus
	private flagged: number
	private revealed: number
	private noGuessing: boolean

	constructor({
		params,
		type = 'classic',
		seed,
		noGuessing = false,
	}: MineSweeperConfig) {
		this.params = params
		this.field = FieldFactory.create({ params, type, seed })
		this.status = GameStatus.Idle
		this.flagged = 0
		this.revealed = 0
		this.noGuessing = noGuessing
	}

	public revealCell(pos: Position): ActionResult {
		const revealedPositions: Position[] = []
		const unflaggedPositions: Position[] = []
		const animationEvents: AnimationEvent[] = []
		const explodedCells: Position[] = []

		// 1. Обработка первого клика / начала игры
		if (!this.field.isMined || this.status === GameStatus.Idle) {
			this.field.placeMines(pos)
			this.status = GameStatus.Playing
		}

		const targetCell = this.field.getCell(pos)

		// 2. Основная логика
		if (this.status === GameStatus.Playing && !targetCell.isFlagged) {
			if (targetCell.isMine) {
				targetCell.open()
				explodedCells.push(targetCell.position)
				this.status = GameStatus.Lost
			} else if (targetCell.isRevealed) {
				// chord/chording. Когда кликаем по открытой клетке
				const result = this.handleRevealedClick(targetCell)
				revealedPositions.push(...result.revealedPositions)
				unflaggedPositions.push(...result.unflaggedPositions)
				explodedCells.push(...result.exploded)
			} else {
				// Невскрытая и не мина
				const result = this.field.getCell(pos).open()
				revealedPositions.push(...result.revealedPositions)
				unflaggedPositions.push(...result.unflaggedPositions)
			}
		}

		// 3. Подсчет и проверка на победу
		this.revealed += revealedPositions.length
		this.flagged -= unflaggedPositions.length

		if (this.status !== GameStatus.Lost && this.checkForWin()) {
			this.status = GameStatus.Won
		}

		return {
			gameState: this.gameState,
			animationEvents,
			actionChanges: {
				flaggedPositions: [],
				unflaggedPositions,
				revealedPositions,
				explodedCells,
			},
		}
	}

	public toggleFlag(pos: Position): ActionResult {
		let flaggedPositions: Position[] = []
		let unflaggedPositions: Position[] = []

		const cell = this.field.getCell(pos)

		if (this.status === GameStatus.Playing && !cell.isRevealed) {
			const willBeMarked = !cell.isFlagged
			if (!willBeMarked) {
				// Снимаем флаг
				cell.isFlagged = false
				unflaggedPositions.push(pos)
			} else if (this.flagged < this.params.mines) {
				// Ставим флаг
				cell.isFlagged = true
				flaggedPositions.push(pos)
			}
		}

		this.flagged =
			this.flagged - unflaggedPositions.length + flaggedPositions.length

		return {
			gameState: this.gameState,
			animationEvents: [],
			actionChanges: {
				flaggedPositions,
				unflaggedPositions,
				revealedPositions: [],
				explodedCells: [],
			},
		}
	}

	private handleRevealedClick(targetCell: Cell) {
		let revealedPositions: Position[] = []
		let unflaggedPositions: Position[] = []

		const exploded: Position[] = []
		const siblings = this.field.getSiblings(targetCell.position)
		const adjacentFlags = siblings.reduce(
			(sum, pos) => sum + Number(this.field.getCell(pos).isFlagged),
			0
		)

		if (adjacentFlags === targetCell.adjacentMines) {
			for (const sibPos of siblings) {
				const sibCell = this.field.getCell(sibPos)
				if (sibCell.isFlagged || sibCell.isRevealed) continue

				if (sibCell.isMine && !sibCell.isFlagged) {
					// Проигрыш внутри аккорда
					sibCell.open()
					exploded.push(sibPos)
					this.status = GameStatus.Lost
				} else {
					// Открываем безопасную ячейку или пустую область
					const openResult = sibCell.open()
					revealedPositions.push(...openResult.revealedPositions)
					unflaggedPositions.push(...openResult.unflaggedPositions)
				}
			}
		}

		return { revealedPositions, unflaggedPositions, exploded }
	}

	private checkForWin() {
		const { cols, mines, rows } = this.params

		return this.revealed === cols * rows - mines
	}

	get gameState() {
		return {
			drawingData: this.field.getDrawingData(this.status),
			status: this.status,
			flagged: this.flagged,
			revealed: this.revealed,
		}
	}
}
