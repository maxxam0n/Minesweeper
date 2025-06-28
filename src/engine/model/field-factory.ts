import { HexagonalField } from './hexagonal-field'
import { SquareField } from './square-field'
import { FactoryConfig } from './types'

export class FieldFactory {
	static create(config: FactoryConfig) {
		switch (config.type) {
			case 'hexagonal': {
				const hexagonalField = new HexagonalField(config)
				hexagonalField.placeMines()
				return hexagonalField
			}
			case 'square':
			default: {
				const squareField = new SquareField(config)
				squareField.placeMines()
				return squareField
			}
		}
	}
}
