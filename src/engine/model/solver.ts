import { createGrid } from '../lib/utils'
import { Field, Position } from './types'

interface SolvedCell {
	position: Position
	mineProbability: number
	emptyProbability: number
}

// TODO Реализовать более продвинутый решатель поля.
export class Solver {
	private field: Field
	private solvedField: SolvedCell[][]

	constructor(originalField: Field) {
		this.field = originalField.createCopy()

		const { cols, rows } = originalField.params
		this.solvedField = createGrid(rows, cols, ({ col, row }) => {
			return {
				position: { x: col, y: row },
				mineProbability: 0,
				emptyProbability: 0,
			}
		})
	}

	public hasSafeMove() {
		while (true) {
			for (let row of this.field.grid) {
				for (let cell of row) {
					const siblings = this.field
						.getSiblings(cell.position)
						.map(pos => this.field.getCell(pos))

					const closedSiblings = siblings.filter(cell => !cell.isRevealed)
					if (closedSiblings.length === 0) continue

					if (cell.adjacentMines === closedSiblings.length) {
						closedSiblings.forEach(sibling => {
							const pos = sibling.position
							const solvedCell = this.getSolvedCell(pos)
							solvedCell.mineProbability = 1
						})
					}
				}
			}
		}
	}

	private getSolvedCell({ x, y }: Position) {
		return this.solvedField[y][x]
	}
}
