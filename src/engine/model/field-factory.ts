import { FieldModel } from './field'
import { CellDrawingData, Field, FieldType, GameParams } from './types'

export class FieldFactory {
	static create(
		config: { params: GameParams; type?: FieldType; seed?: string },
		field?: CellDrawingData[][]
	): Field {
		switch (config.type) {
			case 'classic':
			default: {
				return new FieldModel(config, field)
			}
		}
	}
}
