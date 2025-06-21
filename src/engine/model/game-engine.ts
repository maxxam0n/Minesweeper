import { BaseField } from './base-field'
import { FieldFactory } from './field-factory'
import {
	CellData,
	FieldType,
	GameMode,
	GameParams,
	GameStatus,
	Position,
	ActionResult,
	GameSnapshot,
} from './types'

type MineSweeperConfig = {
	params: GameParams
	type: FieldType
	seed?: string
	mode?: GameMode
}

export class GameEngine {
	private mode: GameMode
	private field: BaseField<CellData>
	private params: GameParams
	private status: GameStatus

	private flaggedPositions: Position[]
	private revealedPositions: Position[]
	private explodedCells: Position[]
	private missedFlags: Position[]
	private unmarkedMines: Position[]

	constructor({
		params,
		type,
		seed = String(Date.now()),
		mode = 'guessing',
	}: MineSweeperConfig) {
		this.mode = mode
		this.params = params
		this.field = FieldFactory.create({ params, type, seed })
		this.status = GameStatus.Idle
		this.flaggedPositions = []
		this.revealedPositions = []
		this.explodedCells = []
		this.missedFlags = []
		this.unmarkedMines = []
	}

	public revealCell(pos: Position): ActionResult {
		let actionStatus: GameStatus = this.status
		const operetadField = this.field.cloneSelf()

		const revealedPositions: Position[] = []
		const unflaggedPositions: Position[] = []
		const explodedCells: Position[] = []
		const previewPressPositions: Position[] = []

		// 1. Обработка первого клика / начала игры
		if (!operetadField.isMined || actionStatus === GameStatus.Idle) {
			operetadField.placeMines(pos)
			actionStatus = GameStatus.Playing
		}

		const targetCell = operetadField.getCell(pos)

		// 2. Основная логика
		if (actionStatus === GameStatus.Playing && !targetCell.isFlagged) {
			if (targetCell.isMine) {
				previewPressPositions.push(pos)
				targetCell.isRevealed = true
				explodedCells.push(targetCell.position)
			} else if (targetCell.isRevealed) {
				// chord/chording. Когда кликаем по открытой клетке
				const result = this.handleRevealedClick(targetCell, operetadField)
				revealedPositions.push(...result.revealedPositions)
				unflaggedPositions.push(...result.unflaggedPositions)
				explodedCells.push(...result.exploded)
				previewPressPositions.push(...result.previewPressPositions)
			} else {
				// Невскрытая и не мина
				const result = this.openArea(pos, operetadField)
				previewPressPositions.push(pos)
				revealedPositions.push(...result.revealedPositions)
				unflaggedPositions.push(...result.unflaggedPositions)
			}
		}

		const summaryRevealedPositions = [
			...this.revealedPositions,
			...revealedPositions,
		]

		const flaggedPositions = this.flaggedPositions.filter(
			pos => !unflaggedPositions.includes(pos)
		)

		const missedFlags = flaggedPositions.filter(
			pos => !operetadField.getCell(pos).isMine
		)

		// 3. Подсчет и проверка на победу
		if (explodedCells.length > 0) actionStatus = GameStatus.Lost
		else if (this.checkForWin(summaryRevealedPositions.length)) {
			actionStatus = GameStatus.Won
		}

		const applyAction = () => {
			this.status = actionStatus
			this.field = operetadField
			this.revealedPositions = summaryRevealedPositions
			this.flaggedPositions = flaggedPositions
			this.explodedCells = explodedCells
			this.missedFlags = missedFlags
		}

		return {
			data: {
				actionSnapshot: {
					status: actionStatus,
					field: operetadField.getDrawingData(actionStatus),
					flaggedPositions: flaggedPositions,
					revealedPositions: summaryRevealedPositions,
					minesPositions: operetadField.getMinesPositions(),
					unmarkedMines: this.unmarkedMines,
					explodedCells,
					missedFlags,
				},
				actionChanges: {
					targetPosition: pos,
					flaggedPositions: [],
					unflaggedPositions,
					revealedPositions,
					explodedCells,
					previewPressPositions,
				},
			},
			apply: applyAction,
		}
	}

	public toggleFlag(pos: Position): ActionResult {
		const operetadField = this.field.cloneSelf()

		let flaggedPositions: Position[] = []
		let unflaggedPositions: Position[] = []

		const cell = operetadField.getCell(pos)

		if (this.status === GameStatus.Playing && !cell.isRevealed) {
			if (cell.isFlagged) {
				// Снимаем флаг
				cell.isFlagged = false
				unflaggedPositions.push(pos)
			} else if (this.flaggedPositions.length < this.params.mines) {
				// Ставим флаг
				cell.isFlagged = true
				flaggedPositions.push(pos)
			}
		}

		const summaryFlaggedPositions = this.flaggedPositions
			.filter(pos => !unflaggedPositions.includes(pos))
			.concat(flaggedPositions)

		const missedFlags = summaryFlaggedPositions.filter(
			pos => !operetadField.getCell(pos).isMine
		)

		const unmarkedMines = this.unmarkedMines
			.filter(pos => !unflaggedPositions.includes(pos))
			.concat(flaggedPositions)
			.filter(pos => operetadField.getCell(pos).isMine)

		const applyAction = () => {
			this.flaggedPositions = summaryFlaggedPositions
			this.missedFlags = missedFlags
			this.unmarkedMines = unmarkedMines
			this.field = operetadField
		}

		return {
			data: {
				actionSnapshot: {
					status: this.status,
					field: operetadField.getDrawingData(this.status),
					revealedPositions: this.revealedPositions,
					flaggedPositions: summaryFlaggedPositions,
					minesPositions: operetadField.getMinesPositions(),
					missedFlags: missedFlags,
					unmarkedMines: unmarkedMines,
					explodedCells: this.explodedCells,
				},
				actionChanges: {
					explodedCells: [],
					flaggedPositions,
					previewPressPositions: [],
					revealedPositions: [],
					targetPosition: pos,
					unflaggedPositions,
				},
			},
			apply: applyAction,
		}
	}

	private handleRevealedClick(
		targetCell: CellData,
		operatedField: BaseField<CellData>
	) {
		const revealedPositions: Position[] = []
		const unflaggedPositions: Position[] = []
		const previewPressPositions: Position[] = []

		const exploded: Position[] = []
		const siblings = operatedField.getSiblings(targetCell.position)
		const closedSiblings = siblings.filter(sib => {
			const sibCell = operatedField.getCell(sib)
			return !sibCell.isRevealed && !sibCell.isFlagged
		})
		const adjacentFlags = siblings.reduce(
			(sum, pos) => sum + Number(operatedField.getCell(pos).isFlagged),
			0
		)

		if (adjacentFlags === targetCell.adjacentMines) {
			previewPressPositions.push(...closedSiblings)

			for (const sibPos of siblings) {
				const sibCell = operatedField.getCell(sibPos)
				if (sibCell.isFlagged || sibCell.isRevealed) continue

				if (sibCell.isMine && !sibCell.isFlagged) {
					// Проигрыш внутри аккорда
					sibCell.isRevealed = true
					exploded.push(sibPos)
				} else {
					// Открываем безопасную ячейку или пустую область
					const openResult = this.openArea(sibPos, operatedField)
					revealedPositions.push(...openResult.revealedPositions)
					unflaggedPositions.push(...openResult.unflaggedPositions)
				}
			}
		}

		return {
			revealedPositions,
			unflaggedPositions,
			exploded,
			previewPressPositions,
		}
	}

	private openArea(pos: Position, operatedField: BaseField<CellData>) {
		let unflaggedPositions: Position[] = []
		let revealedPositions: Position[] = []

		const area = operatedField.getAreaToReveal(pos)

		area.forEach(areaPos => {
			const cellToProcess = operatedField.getCell(areaPos)
			if (cellToProcess.isFlagged) {
				cellToProcess.isFlagged = false
				unflaggedPositions.push(areaPos)
			}
			if (!cellToProcess.isRevealed) {
				revealedPositions.push(areaPos)
				cellToProcess.isRevealed = true
			}
		})
		return { unflaggedPositions, revealedPositions }
	}

	private checkForWin(revealedCount: number) {
		const { cols, mines, rows } = this.params

		return revealedCount === cols * rows - mines
	}

	get gameSnapshot(): GameSnapshot {
		return {
			field: this.field.getDrawingData(this.status),
			status: this.status,
			flaggedPositions: this.flaggedPositions,
			revealedPositions: this.revealedPositions,
			minesPositions: this.field.getMinesPositions(),
			unmarkedMines: this.unmarkedMines,
			explodedCells: this.explodedCells,
			missedFlags: this.missedFlags,
		}
	}
}
