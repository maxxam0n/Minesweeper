import { SquareField } from './square-field'
import { CellData, FieldType, GameParams } from './types'

interface Config {
	params: GameParams
	type: FieldType
	seed?: string
	data?: CellData[][]
}

export class FieldFactory {
	static create(config: Config) {
		switch (config.type) {
			case 'square':
				const field = new SquareField({ ...config })
				field.placeMines()
				return field
		}
	}
}
