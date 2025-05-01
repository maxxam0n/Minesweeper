import { MouseEvent, useMemo } from 'react'
import { Cell } from './components/Cell'
import { CellModel } from './model/CellModel'
import { Position } from './model/types'
import { useFieldColors } from './hooks/useFieldColors'

interface ISVGFieldProps {
	field: CellModel[][]
	isGameOver: boolean
	cellSize: number
	openCell: (pos: Position) => void
	markCell: (pos: Position) => void
}

export function SVGField({
	field,
	cellSize,
	isGameOver,
	openCell,
	markCell,
}: ISVGFieldProps) {
	const colors = useFieldColors()
	const [rows, cols] = [field.length, field[0].length]

	const clickHandler = (
		e: MouseEvent<HTMLDivElement>,
		cb: (pos: Position) => void
	) => {
		e.preventDefault()
		const target = e.nativeEvent.target
		if (!(target instanceof Element)) return
		const cell = target.closest('.cell')
		if (!(cell instanceof HTMLElement)) return
		const { x, y } = cell.dataset
		if (x === undefined || y === undefined) return
		cb({ x: Number(x), y: Number(y) })
	}

	const renderedField = useMemo(() => {
		return field.flatMap(row =>
			row.map(({ key, ...cell }) => (
				<Cell key={key} size={cellSize} isGameOver={isGameOver} {...cell} />
			))
		)
	}, [field])

	const fieldStyle = {
		gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
		width: cellSize * cols + 'px',
		height: cellSize * rows + 'px',
		backgroundColor: colors.REVEALED,
	}

	return (
		<div
			className="grid"
			onClick={e => clickHandler(e, openCell)}
			onContextMenu={e => clickHandler(e, markCell)}
			style={fieldStyle}
		>
			{renderedField}
		</div>
	)
}
