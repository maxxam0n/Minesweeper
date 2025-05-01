import { Position } from '../../modules/game-field/model/types'

export const createGrid = <T>(
	rows: number,
	cols: number,
	cb: (pos: Position) => T
) => {
	return Array.from({ length: rows }, (_, y) =>
		Array.from({ length: cols }, (_, x) => cb({ y, x }))
	)
}
