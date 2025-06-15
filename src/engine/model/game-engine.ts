import { FieldFactory } from './field-factory'
import { Solver } from './solver'
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
		const animationEvents: AnimationEvent[] = []

		let revealedPositions: Position[] = []
		let unflaggedPositions: Position[] = []

		const explodedCells: Position[] = []

		// 1. Обработка первого клика / начала игры
		if (!this.field.isMined || this.status === GameStatus.Idle) {
			this.field.placeMines(pos)
			this.status = GameStatus.Playing
		}

		const targetCell = this.field.getCell(pos)

		// 2. Основная логика
		if (this.status === GameStatus.Playing && !targetCell.isFlagged) {
			// Для режима без угадывания, переставляем мину в случае ситуации 50/50 перед основной логикой
			if (targetCell.isMine && this.noGuessing) {
				const solver = new Solver(this.field)
				if (!solver.hasSafeMove()) {
					const relocationSuccess = this.relocateMine(pos)
					if (!relocationSuccess) {
						// На случай, если переместить мину не удалось (например, все клетки уже открыты)
						// Ведем себя как обычно - взрываемся.
						// Этот случай очень редкий, но лучше его обработать.
					}
				}
			}

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

				if (result.revealedPositions.length > 1) {
					animationEvents.push({
						type: 'cascade',
						positions: result.revealedPositions,
					})
				} else {
					animationEvents.push({ type: 'press', pos })
				}

				revealedPositions.push(...result.revealedPositions)
				unflaggedPositions.push(...result.unflaggedPositions)
			}
		} else if (
			this.status === GameStatus.Lost ||
			this.status === GameStatus.Won
		) {
			console.warn('[Minesweeper]: Game is over!')
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
		// Если открыты все незаминированные клетки.
		// В revealed записываются только незаминированные ячейки,
		// поэтому этого условия достаточно для определения победы
		return this.revealed === cols * rows - mines
	}

	// @TODO Возможно стоит перенести метод в сам FieldModel
	private relocateMine(fromPos: Position): boolean {
		// 1. Найти подходящее место для новой мины.
		// Это должна быть закрытая и не заминированная клетка.
		let newMinePos: Position | null = null

		// Итерируемся по всему полю в поиске кандидата
		for (const row of this.field.data) {
			for (const cell of row) {
				if (!cell.isMine && !cell.isRevealed) {
					newMinePos = cell.position
					break // Нашли первого кандидата, выходим
				}
			}
			if (newMinePos) break // Выходим из внешнего цикла
		}

		if (!newMinePos) {
			// Не нашли куда переместить мину (очень редкий случай)
			return false
		}

		// 2. Выполняем перемещение
		const oldMineCell = this.field.getCell(fromPos)
		const newMineCell = this.field.getCell(newMinePos)

		// Убираем старую мину и обновляем соседей
		oldMineCell.isMine = false
		this.field.getSiblings(fromPos).forEach(pos => {
			this.field.getCell(pos).adjacentMines -= 1
		})

		// Ставим новую мину и обновляем соседей
		newMineCell.isMine = true
		this.field.getSiblings(newMinePos).forEach(pos => {
			this.field.getCell(pos).adjacentMines += 1
		})

		// Важно: нужно также обновить счетчик adjacentMines для самой старой клетки,
		// так как она теперь пустая, и для новой, так как она стала миной.
		// Самый простой способ - пересчитать их с нуля.
		this.recalculateAdjacentMines(oldMineCell)
		this.recalculateAdjacentMines(newMineCell)

		return true
	}

	// Вспомогательный метод для пересчета соседей
	private recalculateAdjacentMines(cell: Cell) {
		if (cell.isMine) {
			cell.adjacentMines = 0 // У мины нет этого счетчика
			return
		}
		const siblingMines = this.field
			.getSiblings(cell.position)
			.reduce(
				(sum, pos) => sum + (this.field.getCell(pos).isMine ? 1 : 0),
				0
			)
		cell.adjacentMines = siblingMines
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
