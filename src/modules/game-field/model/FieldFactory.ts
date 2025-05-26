import { FieldModel } from './FieldModel'
import { Field, FieldParams } from './types'

export class FieldFactory {
	static create(config: FieldParams): Field {
		switch (config.type) {
			case 'classic':
			default: {
				return new FieldModel(config)
			}
		}
	}
}
