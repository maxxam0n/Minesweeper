import { URLConfig } from '@/widgets/minesweeper-game'
import { mockField } from './mocks'

export const useMockParams = () => {
	const field = mockField

	const params = field.reduce(
		(acc, row) => {
			return {
				mines: acc.mines + row.filter(c => c.isMine).length,
				cols: row.length,
				rows: acc.rows + 1,
			}
		},
		{ cols: 0, rows: 0, mines: 0 }
	)

	return {
		fieldData: field,
		config: {
			params,
			type: 'square',
			seed: 'mock',
			mode: 'guessing',
		} as URLConfig,
	}
}
