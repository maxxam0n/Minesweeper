import { Field } from './types'

// TODO Реализовать более продвинутый решатель поля.
export class Solver {
	private field: Field

	constructor(originalField: Field) {
		this.field = originalField.createCopy()
	}

	public hasSafeMove() {}
}
