// import { createGrid } from '../lib/utils'
// import { CellDrawingData, ConstrutorFieldProps, Field } from './types'

// import { FieldModel } from './square-field'
// import { SolverCell } from './solved-cell'

// export class Solver extends FieldModel {
// 	// Переопределяем статические методы, чтобы они создавали SolverCell
// 	private static createEmptyGrid(field: Field) {
// 		return createGrid(
// 			field.params.rows,
// 			field.params.cols,
// 			({ col: x, row: y }) => new SolverCell(field, { x, y })
// 		)
// 	}

// 	private static createGridFromData(field: Field, data: CellDrawingData[][]) {
// 		return data.map(row =>
// 			row.map(cellData => SolverCell.createFromData(field, cellData))
// 		)
// 	}

// 	public grid: SolverCell[][]

// 	// Конструктор остается таким же, он просто вызовет `super`
// 	constructor(props: ConstrutorFieldProps) {
// 		super(props)
// 		// Важно: нужно будет переопределить создание сетки,
// 		// чтобы использовались наши кастомные статические методы
// 		// Либо передать их в конструктор FieldModel, если он это поддерживает.
// 		// Самый простой вариант - переопределить логику прямо здесь:
// 		if (props.data) {
// 			this.grid = Solver.createGridFromData(this, props.data)
// 		} else {
// 			this.grid = Solver.createEmptyGrid(this)
// 		}
// 	}

// 	// --- НОВЫЕ МЕТОДЫ СОЛВЕРА ---
// 	public analyze() {
// 		// Здесь будет логика продвинутого решателя,
// 		// которая вычисляет и устанавливает this.getCell(pos).probability
// 	}

// 	public getHeatmap() {
// 		// Возвращает массив данных для визуализации
// 		return this.grid.flat().map(cell => ({
// 			position: cell.position,
// 			...cell.getHeatmapData(),
// 		}))
// 	}
// }
