import { SquareField } from './square-field'
import { FactoryConfig } from './types'

export class FieldFactory {
	static create(config: FactoryConfig) {
		switch (config.type) {
			default:
				const squareField = new SquareField(config)
				squareField.placeMines()
				return squareField
		}
	}
}
