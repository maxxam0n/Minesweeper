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
			default:
				const squareField = new SquareField({ ...config })
				squareField.placeMines()
				return squareField
		}
	}
}
