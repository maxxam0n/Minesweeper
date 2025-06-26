import { BaseField } from './base-field'
import { FieldFactory } from './field-factory'
import { SimpleCell } from './simple-cell'
import { CellData, FactoryConfig, GameParams, MineProbability } from './types'

export class Solver {
	private field: BaseField<SimpleCell>
	private params: GameParams

	constructor(config: FactoryConfig) {
		this.params = config.params
		this.field = FieldFactory.create(config)
	}

	// Находит стопроцентные вероятности мин
	private findMaximumProbabilities(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	) {
		let finded = false
		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closedSiblings = siblings.filter(sib => !sib.isRevealed)

			if (closedSiblings.length === 0) continue

			const zeroProbabilities = closedSiblings.filter(sib => {
				const key = SimpleCell.createKey(sib.position)
				return probabilities.get(key)?.value === 0
			})

			// Если количество мин в соседних клетках равно количеству закрытых соседних клеток
			// Вероятность мины в закрытой клетке равна 1
			if (cell.adjacentMines === closedSiblings.length) {
				closedSiblings.forEach(sib => {
					const key = SimpleCell.createKey(sib.position)
					if (probabilities.has(key)) return
					probabilities.set(key, { value: 1, position: sib.position })
					finded = true
				})
			} else if (
				cell.adjacentMines ===
				closedSiblings.length - zeroProbabilities.length
			) {
				const unknownProbabilities = closedSiblings.filter(
					sib => !zeroProbabilities.includes(sib)
				)
				unknownProbabilities.forEach(sib => {
					const key = SimpleCell.createKey(sib.position)
					if (probabilities.has(key)) return
					probabilities.set(key, { value: 1, position: sib.position })
					finded = true
				})
			}
		}
		return finded
	}

	// Находит нулевые вероятности мин на основе стопроцентных
	private findZeroProbabilities(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	) {
		let finded = false

		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closedSiblings = siblings.filter(sib => !sib.isRevealed)

			if (closedSiblings.length === 0) continue

			if (cell.adjacentMines < closedSiblings.length) {
				// Количество стопроцентных вероятностей мин на соседних закрытых клетках
				const existingProbabilities = closedSiblings.filter(sib => {
					const key = SimpleCell.createKey(sib.position)
					return probabilities.get(key)?.value === 1
				})

				// Если это количество равно цифре на целевой клетке, все остальные закрытые клетки имеют вероятность 0
				if (existingProbabilities.length === cell.adjacentMines) {
					const notAnalyzed = closedSiblings.filter(
						sib => !existingProbabilities.includes(sib)
					)

					notAnalyzed.forEach(sib => {
						const key = SimpleCell.createKey(sib.position)
						if (probabilities.has(key)) return
						finded = true
						probabilities.set(key, {
							value: 0,
							position: sib.position,
						})
					})
				}
			}
		}

		return finded
	}

	// Рассчитывает вероятности мин для более сложных паттернов
	private findRemainingProbabilities(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	) {
		let finded = false

		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closedSiblings = siblings.filter(sib => !sib.isRevealed)

			if (closedSiblings.length === 0) continue

			if (cell.adjacentMines < closedSiblings.length) {
				// Количество стопроцентных вероятностей мин на соседних закрытых клетках
				const existingProbabilities = closedSiblings.filter(sib => {
					const key = SimpleCell.createKey(sib.position)
					return probabilities.get(key)?.value === 1
				})

				const cellsToAnalyze = closedSiblings.filter(
					sib => !existingProbabilities.includes(sib)
				)

				const localProbability =
					(cell.adjacentMines - existingProbabilities.length) /
					cellsToAnalyze.length

				cellsToAnalyze.forEach(cell => {
					const key = SimpleCell.createKey(cell.position)
					if (probabilities.has(key)) return
					finded = true
					probabilities.set(key, {
						value: localProbability,
						position: cell.position,
					})
				})
			}
		}

		return finded
	}

	// Функция для расчета вероятностей
	// 1. Определить закрытые клетки соседствующие с открытыми
	// 2. Определить логические правила нахождения вероятностей
	// 3. Итерация по всем клеткам и расчет вероятностей
	// 4. Возврат вероятностей
	public analyze(): MineProbability[] {
		const probabilities: Map<string, MineProbability> = new Map()

		const fieldState = this.field.getState()

		let finded = false
		do {
			const foundMax = this.findMaximumProbabilities(
				fieldState.revealedCells,
				probabilities
			)
			const foundZero = this.findZeroProbabilities(
				fieldState.revealedCells,
				probabilities
			)

			finded = foundMax || foundZero
		} while (finded)

		finded = false
		do {
			finded = this.findRemainingProbabilities(
				fieldState.revealedCells,
				probabilities
			)
		} while (finded)

		return Array.from(probabilities.values())
	}

	public isGuessingState(): boolean {
		const probabilities = this.analyze()

		for (const prob of probabilities) {
			if (prob.value === 0) {
				return false
			}
		}

		const fieldState = this.field.getState()

		const revealedCellsCount =
			fieldState.revealedCells.length - fieldState.explodedCells.length

		const isSolved =
			revealedCellsCount ===
			this.params.cols * this.params.rows - fieldState.minedCells.length

		return !isSolved
	}
}
