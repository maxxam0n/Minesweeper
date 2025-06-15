import { FieldModel } from './field'
import { CellDrawingData, Field, FieldType, GameParams } from './types'

interface Config {
	params: GameParams
	type?: FieldType
	seed?: string
}

export class FieldFactory {
	static create(config: Config, data?: CellDrawingData[][]): Field {
		switch (config.type) {
			case 'classic':
			default: {
				return new FieldModel({ ...config, data })
			}
		}
	}
}
