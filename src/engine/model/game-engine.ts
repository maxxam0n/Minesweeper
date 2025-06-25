import { BaseField } from './base-field'
import { FieldFactory } from './field-factory'
import { SimpleCell } from './simple-cell'
import {
	CellData,
	FieldType,
	GameMode,
	GameParams,
	GameStatus,
	Position,
	ActionResult,
	GameSnapshot,
	FieldState,
} from './types'

type MineSweeperConfig = {
	params: GameParams
	type: FieldType
	seed?: string
	mode?: GameMode
}

export class GameEngine {
	private mode: GameMode
	private field: BaseField<SimpleCell>
	private params: GameParams
	private status: GameStatus

	private flagsRemaining: number

	constructor({
		params,
		type,
		seed = String(Date.now()),
		mode = 'guessing',
	}: MineSweeperConfig) {
		this.mode = mode
		this.params = params
		this.field = FieldFactory.create({ params, type, seed })
		this.flagsRemaining = params.mines
		this.status = GameStatus.Idle
	}

	public revealCell(pos: Position): ActionResult {
		let actionStatus: GameStatus = this.status
		const operetadField = this.field.cloneSelf()

		const flaggedCells: CellData[] = []
		const unflaggedCells: CellData[] = []
		const revealedCells: CellData[] = []
		const handledCells: CellData[] = []
		const explodedCells: CellData[] = []

		// 1. Обработка первого клика / начала игры
		if (actionStatus === GameStatus.Idle) {
			if (!operetadField.isMined) operetadField.placeMines(pos)
			if (operetadField.getCellData(pos).isMine) {
				const unminedCell = operetadField.grid
					.flat()
					.find(cell => !cell.isMine)
				if (!unminedCell) {
					actionStatus = GameStatus.Lost
				} else {
					operetadField.relocateMine(pos, unminedCell.position)
					actionStatus = GameStatus.Playing
				}
			} else {
				actionStatus = GameStatus.Playing
			}
		}

		const target = operetadField.getCell(pos)

		// 2. Основная логика
		if (actionStatus === GameStatus.Playing && !target.isFlagged) {
			const cellData = target.getData()
			if (target.isMine) {
				target.isRevealed = true
				handledCells.push(cellData)
				explodedCells.push(cellData)
			} else if (target.isRevealed) {
				// chord/chording. Когда кликаем по открытой клетке
				const result = this.handleRevealedClick(target, operetadField)
				revealedCells.push(...result.revealedCells)
				unflaggedCells.push(...result.unflaggedCells)
				explodedCells.push(...result.explodedCells)
				handledCells.push(...result.handledCells)
			} else {
				// Невскрытая и не мина
				handledCells.push(cellData)
				const result = this.openArea(pos, operetadField)
				revealedCells.push(...result.revealedCells)
				unflaggedCells.push(...result.unflaggedCells)
			}
		}

		const resultState = operetadField.getState()
		actionStatus = this.determineStatus(resultState)

		const applyAction = () => {
			this.status = actionStatus
			this.field = operetadField
			this.flagsRemaining = this.getFlagsRemaining(resultState)
		}

		return {
			data: {
				actionSnapshot: Object.assign(resultState, {
					status: actionStatus,
				}),
				actionChanges: {
					target,
					explodedCells,
					flaggedCells,
					revealedCells,
					handledCells,
					unflaggedCells,
				},
			},
			apply: applyAction,
		}
	}

	public toggleFlag(pos: Position): ActionResult {
		const operetadField = this.field.cloneSelf()

		const flaggedCells: CellData[] = []
		const unflaggedCells: CellData[] = []

		const cell = operetadField.getCell(pos)
		const cellData = cell.getData()

		if (this.status === GameStatus.Playing && !cell.isRevealed) {
			if (cell.isFlagged) {
				// Снимаем флаг
				cell.isFlagged = false
				unflaggedCells.push(cellData)
			} else if (this.flagsRemaining > 0) {
				// Ставим флаг
				cell.isFlagged = true
				flaggedCells.push(cellData)
			}
		}

		const resultState = operetadField.getState()

		const applyAction = () => {
			this.field = operetadField
			this.flagsRemaining = this.getFlagsRemaining(resultState)
		}

		return {
			data: {
				actionSnapshot: Object.assign(resultState, { status: this.status }),
				actionChanges: {
					explodedCells: [],
					flaggedCells,
					unflaggedCells,
					handledCells: [],
					revealedCells: [],
					target: cellData,
				},
			},
			apply: applyAction,
		}
	}

	private handleRevealedClick(
		targetCell: CellData,
		operatedField: BaseField<SimpleCell>
	) {
		const unflaggedCells: CellData[] = []
		const revealedCells: CellData[] = []
		const handledCells: CellData[] = []
		const explodedCells: CellData[] = []

		const siblings = operatedField.getSiblings(targetCell.position)
		const closedSiblings = siblings.filter(({ isUntouched }) => isUntouched)
		const flags = siblings.reduce((sum, sib) => sum + +sib.isFlagged, 0)

		// Условие открытия внутри аккорда
		if (flags === targetCell.adjacentMines) {
			handledCells.push(...closedSiblings.map(sib => sib.getData()))

			for (const sibCell of siblings) {
				if (sibCell.isFlagged || sibCell.isRevealed) continue

				if (sibCell.isMine && !sibCell.isFlagged) {
					// Проигрыш внутри аккорда
					sibCell.isRevealed = true
					explodedCells.push(sibCell.getData())
				} else {
					// Открываем безопасную ячейку или пустую область
					const openResult = this.openArea(sibCell.position, operatedField)
					revealedCells.push(...openResult.revealedCells)
					unflaggedCells.push(...openResult.unflaggedCells)
				}
			}
		}

		return {
			unflaggedCells,
			revealedCells,
			handledCells,
			explodedCells,
		}
	}

	private openArea(pos: Position, operatedField: BaseField<SimpleCell>) {
		const unflaggedCells: CellData[] = []
		const revealedCells: CellData[] = []

		const area = operatedField.getAreaToReveal(pos)

		area.forEach(cellToProcess => {
			const cellData = cellToProcess.getData()
			if (cellToProcess.isFlagged) {
				cellToProcess.isFlagged = false
				unflaggedCells.push(cellData)
			}
			if (!cellToProcess.isRevealed) {
				cellToProcess.isRevealed = true
				revealedCells.push(cellData)
			}
		})
		return { unflaggedCells, revealedCells }
	}

	private determineStatus(resultState: FieldState) {
		const revealedCount = resultState.revealedCells.length
		const { cols, mines, rows } = this.params

		if (resultState.explodedCells.length > 0) return GameStatus.Lost
		else if (revealedCount === cols * rows - mines) return GameStatus.Won
		else return GameStatus.Playing
	}

	private getFlagsRemaining(resultState: FieldState) {
		return this.params.mines - resultState.flaggedCells.length
	}

	get gameSnapshot(): GameSnapshot {
		return Object.assign(this.field.getState(), { status: this.status })
	}
}
