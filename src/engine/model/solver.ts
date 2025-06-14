import { Field } from './types'

// TODO Реализовать более продвинутый решатель поля.
// На данный момент он не учитывает сложные паттерны решения поля
export class Solver {
	private field: Field

	constructor(originalField: Field) {
		this.field = originalField.createCopy()
	}

	public hasSafeMove(): boolean {
		while (true) {
			let moveMadeInIteration = false

			for (const row of this.field.data) {
				for (const cell of row) {
					if (!cell.isRevealed || cell.adjacentMines === 0) {
						continue
					}

					const siblingsPos = this.field.getSiblings(cell.position)
					const closedSiblings = siblingsPos
						.map(pos => this.field.getCell(pos))
						.filter(c => !c.isRevealed)

					if (closedSiblings.length === 0) {
						continue
					}

					const flaggedCount = closedSiblings.filter(
						c => c.isFlagged
					).length
					const unflaggedClosed = closedSiblings.filter(c => !c.isFlagged)

					// Правило 1 (AMF): Нашли безопасные клетки
					if (
						cell.adjacentMines === flaggedCount &&
						unflaggedClosed.length > 0
					) {
						return true
					}

					if (
						cell.adjacentMines - flaggedCount ===
						unflaggedClosed.length
					) {
						// Все оставшиеся неотмеченные закрытые клетки - мины.
						for (const targetCell of unflaggedClosed) {
							if (!targetCell.isFlagged) {
								targetCell.isFlagged = true
								moveMadeInIteration = true
							}
						}
					}
				}
			}

			if (!moveMadeInIteration) {
				break
			}
		}
		return false
	}
}
