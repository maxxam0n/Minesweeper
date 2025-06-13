import { FieldFactory } from './model/field-factory'
import {
	ActionResult,
	Cell,
	Field,
	FieldType,
	GameParams,
	GameStatus,
	Position,
} from './model/types'

type MineSweeperConfig = {
	params: GameParams
	type?: FieldType
}

export class GameEngine {
	private field: Field
	private params: GameParams
	private status: GameStatus
	private flagged: number
	private revealed: number

	constructor({ params, type = 'classic' }: MineSweeperConfig) {
		this.params = params
		this.field = FieldFactory.create({ ...params, type })
		this.status = GameStatus.Idle
		this.flagged = 0
		this.revealed = 0
	}

	public revealCell(pos: Position): ActionResult {
		let revealedInAction = 0
		let unflaggedInAction = 0

		const explodedCells: Position[] = []

		// 1. Обработка первого клика / начала игры
		if (!this.field.isMined || this.status === GameStatus.Idle) {
			this.field.placeMines(pos)
			this.status = GameStatus.Playing
		}

		const targetCell = this.field.getCell(pos)

		// 2. Основная логика
		if (this.status === GameStatus.Playing) {
			if (targetCell.isMine) {
				targetCell.open()
				explodedCells.push(targetCell.position)
				this.status = GameStatus.Lost
			} else if (targetCell.isRevealed) {
				// chord/chording. Когда кликаем по открытой клетке
				const result = this.handleRevealedClick(targetCell)
				revealedInAction += result.revealedInAction
				unflaggedInAction += result.unflaggedInAction
				explodedCells.push(...result.exploded)
			} else {
				// Невскрытая и не мина
				const result = this.field.getCell(pos).open()
				revealedInAction += result.revealedInAction
				unflaggedInAction += result.unflaggedInAction
			}
		} else if (
			this.status === GameStatus.Lost ||
			this.status === GameStatus.Won
		) {
			console.warn('[Minesweeper]: Game is over!')
		}

		// 3. Подсчет и проверка на победу
		this.revealed += revealedInAction
		this.flagged -= unflaggedInAction

		if (this.status !== GameStatus.Lost && this.checkForWin()) {
			this.status = GameStatus.Won
		}

		return {
			gameState: this.gameState,
			actionChanges: {
				flaggedInAction: 0,
				unflaggedInAction,
				revealedInAction,
				explodedCells,
			},
		}
	}

	public toggleFlag(pos: Position): ActionResult {
		let flaggedInAction = 0
		let unflaggedInAction = 0

		const cell = this.field.getCell(pos)

		if (this.status === GameStatus.Playing && !cell.isRevealed) {
			const willBeMarked = !cell.isFlagged
			if (!willBeMarked) {
				// Снимаем флаг
				cell.isFlagged = false
				unflaggedInAction = 1
			} else if (this.flagged < this.params.mines) {
				// Ставим флаг
				cell.isFlagged = true
				flaggedInAction = 1
			}
		} else if (
			this.status === GameStatus.Lost ||
			this.status === GameStatus.Won
		) {
			// Ничего не делаем, не обновляем переменные marked или markedInAction или unmarked
			// Todo: пока что пусть будет просто предупреждение в консоль.
			// Как вариант возвращать ошибку или вообще ничего
			console.warn('[Minesweeper]: Game is over!')
		} else if (this.status === GameStatus.Idle) {
			// Аналогично...
			console.warn('[Minesweeper]: Game is not started, open cell before!')
		}

		this.flagged = this.flagged - unflaggedInAction + flaggedInAction

		return {
			gameState: this.gameState,
			actionChanges: {
				flaggedInAction,
				unflaggedInAction,
				revealedInAction: 0,
				explodedCells: [],
			},
		}
	}

	private handleRevealedClick(targetCell: Cell) {
		let revealedInAction = 0
		let unflaggedInAction = 0

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
					revealedInAction += openResult.revealedInAction
					unflaggedInAction += openResult.unflaggedInAction
				}
			}
		}

		return { revealedInAction, unflaggedInAction, exploded }
	}

	private checkForWin() {
		const { cols, mines, rows } = this.params
		// Если открыты все незаминированные клетки.
		// В revealed записываются только незаминированные ячейки,
		// поэтому этого условия достаточно для определения победы
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
