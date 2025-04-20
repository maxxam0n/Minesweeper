import { MouseEvent } from 'react'
import { CellModel } from '../model/CellModel'
import { TPosition } from '../model/types'
import { Cell } from './Cell'

interface IBoardProps {
	board: CellModel[][]
	isGameOver: boolean
	openCell: (pos: TPosition) => void
	markCell: (pos: TPosition) => void
	size: number
}

export const Board = ({
	board,
	size,
	isGameOver,
	openCell,
	markCell,
}: IBoardProps) => {
	const [rows, cols] = [board.length, board[0].length]

	const clickHandler = (
		e: MouseEvent<HTMLDivElement>,
		cb: (pos: TPosition) => void
	) => {
		e.preventDefault()
		const cell = e.nativeEvent.target?.closest('.cell')
		if (cell) {
			const { y, x } = cell.dataset
			cb({ y: Number(y), x: Number(x) })
		}
	}

	const renderedBoard = board.flatMap(row =>
		row.map(cell => (
			<Cell
				key={cell.key}
				isGameOver={isGameOver}
				size={size}
				cellModel={cell}
			/>
		))
	)

	return (
		<div
			className="grid"
			onClick={e => clickHandler(e, openCell)}
			onContextMenu={e => clickHandler(e, markCell)}
			style={{
				gridTemplateColumns: `repeat(${cols}, ${size}px)`,
				width: size * cols,
				height: size * rows,
			}}
		>
			{renderedBoard}
		</div>
	)
}
