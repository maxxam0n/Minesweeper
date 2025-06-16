// import { CellModel } from './simple-cell'
// import { Field, Position } from './types'

// export class SolvedCell extends CellModel {
// 	public probability: number = 0 // Вероятность мины от 0 до 1

// 	constructor(field: Field, position: Position) {
// 		super(field, position)
// 	}

// 	// Метод для получения данных для "тепловой карты"
// 	public getHeatmapData() {
// 		if (this.isRevealed) {
// 			return { probability: 0 }
// 		}
// 		return {
// 			probability: this.probability,
// 		}
// 	}
// }
