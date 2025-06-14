import { Cell, Field } from './types'
export class Solver {
	private field: Field

	constructor(field: Field) {
		this.field = field.createCopy()
	}

	public hasSafeMove(): boolean {
		for (const row of this.field.data) {
			for (const cell of row) {
				if (!cell.isRevealed || cell.adjacentMines === 0) {
					continue
				}

				const siblings = this.field.getSiblings(cell.position)
				const closedSiblings = siblings
					.filter(pos => !this.field.getCell(pos).isRevealed)
					.map(this.field.getCell)

				if (this.canRevealSiblings(cell, closedSiblings)) {
					return true
				}
			}
		}

		return false
	}

	private canRevealSiblings(cell: Cell, closedSiblings: Cell[]): boolean {
		const flaggedSiblings = closedSiblings.filter(c => c.isFlagged)

		// Условие, что все мины помечены, и можно спокойно открыть соседнюю не помеченную флагом клетку
		if (cell.adjacentMines === flaggedSiblings.length) {
			// Проверяем, если на соседних закрытых клеток нет флажка, значит ее можно открыть
			if (closedSiblings.filter(c => !c.isFlagged).length > 0) {
				return true
			}
		}

		return false
	}
}
