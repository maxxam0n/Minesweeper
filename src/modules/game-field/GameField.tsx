import { useMemo } from 'react'
import { CellModel } from './model/CellModel'
import { FieldColors, Position } from './model/types'
import { CanvasField } from './CanvasField'
import { SVGField } from './SVGField'
import { ColorsContext } from './model/ColorsContext'

interface IFieldProps {
	field: CellModel[][]
	isGameOver: boolean
	type: 'canvas' | 'svg'
	colors: FieldColors
	cellSize: number
	openCell: (pos: Position) => void
	markCell: (pos: Position) => void
}

export const GameField = ({
	field,
	cellSize,
	isGameOver,
	type,
	colors,
	openCell,
	markCell,
}: IFieldProps) => {
	if (field.length === 0) return null

	const Field = useMemo(() => {
		return [CanvasField, SVGField][Number(type === 'svg')]
	}, [type])

	return (
		<ColorsContext.Provider value={colors}>
			<Field
				field={field}
				cellSize={cellSize}
				isGameOver={isGameOver}
				openCell={openCell}
				markCell={markCell}
			/>
		</ColorsContext.Provider>
	)
}
