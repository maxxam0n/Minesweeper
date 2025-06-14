import { FieldModel } from './field'
import { Cell, Field, FieldType, GameParams } from './types'

export class FieldFactory {
	static create(
		config: { params: GameParams; type?: FieldType; seed?: string },
		field?: Cell[][]
	): Field {
		switch (config.type) {
			case 'classic':
			default: {
				return new FieldModel(config, field)
			}
		}
	}
}
