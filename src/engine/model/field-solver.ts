import { createKey } from '../lib/utils'
import { BaseField } from './base-field'
import { FieldFactory } from './field-factory'
import { SimpleCell } from './simple-cell'
import { CellData, FactoryConfig, MineProbability } from './types'

export class Solver {
	private field: BaseField<SimpleCell>

	constructor(config: FactoryConfig) {
		this.field = FieldFactory.create(config)
	}

	public solve(): MineProbability[] {
		const probabilities: Map<string, MineProbability> = new Map()
		const fieldState = this.field.getState()
		const regions = this.groupConnectedRegions(fieldState.revealedCells)

		for (const region of regions) {
			let changed: boolean
			do {
				const foundMines = this.inferCertainMines(region, probabilities)
				const foundSafe = this.inferCertainSafeCells(region, probabilities)

				changed = foundMines || foundSafe

				if (!changed) {
					changed = this.inferFloatingProbabilities(region, probabilities)
				}
			} while (changed)
		}

		return Array.from(probabilities.values())
	}

	public isGuessingState(): boolean {
		const probabilities = this.solve()

		for (const prob of probabilities) {
			if (prob.value === 0) {
				return false
			}
		}
		return true
	}

	// Определяет клетки со стопроцентной вероятностью нахождения мины по правилу:
	// Если на открытой клетке цифра равна количеству количеству закрытых клеток с не нулевой вероятностью,
	// То все они - мины
	private inferCertainMines(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	): boolean {
		let updated = false

		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closed = siblings.filter(s => !s.isRevealed)

			if (closed.length === 0) continue

			const knownSafe = closed.filter(
				s => probabilities.get(createKey(s.position))?.value === 0
			)

			if (cell.adjacentMines === closed.length - knownSafe.length) {
				for (const sib of closed) {
					const key = createKey(sib.position)
					if (probabilities.has(key)) continue
					probabilities.set(key, { value: 1, position: sib.position })
					updated = true
				}
			}
		}

		return updated
	}

	// Находит безопасные закрытые клетки на основе простого правила:
	// Если на открытой клетке цифра равна количеству стопроцентных вероятностей на соседних закрытых клетах,
	// То остальные закрытые клетки - безопасны
	private inferCertainSafeCells(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	): boolean {
		let updated = false

		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closed = siblings.filter(s => !s.isRevealed)

			if (closed.length === 0) continue

			const knownMines = closed.filter(
				s => probabilities.get(createKey(s.position))?.value === 1
			)

			if (knownMines.length === cell.adjacentMines) {
				for (const sib of closed) {
					const key = createKey(sib.position)
					if (probabilities.has(key)) continue
					probabilities.set(key, { value: 0, position: sib.position })
					updated = true
				}
			}
		}

		return updated
	}

	// Рассчитывает не абсолютные (0 или 1) вероятности
	private inferFloatingProbabilities(
		cells: CellData[],
		probabilities: Map<string, MineProbability>
	): boolean {
		let updated = false

		for (const cell of cells) {
			if (cell.isEmpty || cell.isMine) continue

			const siblings = this.field.getSiblings(cell.position)
			const closed = siblings.filter(s => !s.isRevealed)

			if (closed.length === 0) continue

			const knownMines = closed.filter(
				s => probabilities.get(createKey(s.position))?.value === 1
			)

			const unknown = closed.filter(s => !knownMines.includes(s))

			if (unknown.length === 0) continue

			const remainingMines = cell.adjacentMines - knownMines.length
			const prob = remainingMines / unknown.length

			for (const sib of unknown) {
				const key = createKey(sib.position)
				if (probabilities.has(key)) continue
				probabilities.set(key, { value: prob, position: sib.position })
				updated = true
			}
		}

		return updated
	}

	// Определяем список групп (регионов), каждая из которых включает все открытые клетки, которые:
	// 1. находятся рядом друг с другом
	// 2. делят хотя бы одну общую закрытую клетку
	private groupConnectedRegions(cells: CellData[]): CellData[][] {
		const visited = new Set<string>()
		const regions: CellData[][] = []

		for (const cell of cells) {
			const key = createKey(cell.position)
			if (visited.has(key)) continue

			// Пропускаем "мёртвые" открытые клетки (не имеющие закрытых соседей)
			const siblings = this.field.getSiblings(cell.position)
			const hasClosed = siblings.some(s => !s.isRevealed)

			if (!hasClosed) continue

			const group: CellData[] = []
			const queue: CellData[] = [cell]

			while (queue.length > 0) {
				const current = queue.pop()!
				const currentKey = createKey(current.position)
				if (visited.has(currentKey)) continue

				visited.add(currentKey)
				group.push(current)

				const neighbors = this.field
					.getSiblings(current.position)
					.filter(n => n.isRevealed && !visited.has(createKey(n.position)))

				for (const neighbor of neighbors) {
					const nSiblings = this.field.getSiblings(neighbor.position)
					const nHasClosed = nSiblings.some(s => !s.isRevealed)
					if (nHasClosed) {
						queue.push(neighbor)
					}
				}
			}

			if (group.length > 0) {
				regions.push(group)
			}
		}

		return regions
	}

	// Для отладки метода
	public createConnectedRegions(): CellData[][] {
		const fieldState = this.field.getState()
		return this.groupConnectedRegions(fieldState.revealedCells)
	}
}
