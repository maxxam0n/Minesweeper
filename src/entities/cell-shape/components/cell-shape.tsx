import { memo } from 'react'
import { CellDrawingView } from '@/engine'
import { CellData, ViewConfig } from '../lib/types'
import { BevelShape } from './bevel-shape'
import { BaseCellShape } from './base-cell-shape'
import { DigitShape } from './digit-shape'
import { FlagShape } from './flag-shape'
import { MineShape } from './mine-shape'
import { MissedShape } from './missed-shape'

interface CellProps {
	data: CellData
	viewConfig: ViewConfig
}

const areCellsEqual = (
	prevProps: Readonly<CellProps>,
	nextProps: Readonly<CellProps>
): boolean => {
	return (
		prevProps.data.view === nextProps.data.view &&
		prevProps.viewConfig === nextProps.viewConfig
	)
}

const CellShapeComponent = ({ data, viewConfig }: CellProps) => {
	const { position, view, adjacentMines } = data

	const {
		cellSize,
		bevelWidth = 3,
		borderWidth = 1,
		font = 'Digital',
	} = viewConfig

	// Рассчитываем позицию ячейки на холсте
	const x = position.x * cellSize
	const y = position.y * cellSize

	switch (view) {
		case CellDrawingView.Closed:
			return (
				<BevelShape x={x} y={y} size={cellSize} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={cellSize}
						borderWidth={borderWidth}
					/>
				</BevelShape>
			)

		case CellDrawingView.Empty:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={cellSize}
					open={true}
					borderWidth={borderWidth}
				/>
			)

		case CellDrawingView.Digit:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={cellSize}
					open={true}
					borderWidth={borderWidth}
				>
					<DigitShape
						digit={adjacentMines}
						x={x}
						y={y}
						size={cellSize}
						font={font}
					/>
				</BaseCellShape>
			)

		case CellDrawingView.Flag:
			return (
				<BevelShape x={x} y={y} size={cellSize} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={cellSize}
						borderWidth={borderWidth}
					>
						<FlagShape x={x} y={y} size={cellSize} />
					</BaseCellShape>
				</BevelShape>
			)

		case CellDrawingView.Mine:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={cellSize}
					borderWidth={borderWidth}
					open={true}
				>
					<MineShape x={x} y={y} size={cellSize} />
				</BaseCellShape>
			)

		case CellDrawingView.Exploded:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={cellSize}
					borderWidth={borderWidth}
					exploded={true}
				>
					<MineShape x={x} y={y} size={cellSize} />
				</BaseCellShape>
			)

		case CellDrawingView.Missed:
			return (
				<BevelShape x={x} y={y} size={cellSize} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={cellSize}
						missed={true}
						borderWidth={borderWidth}
					>
						<MissedShape x={x} y={y} size={cellSize} />
					</BaseCellShape>
				</BevelShape>
			)

		default:
			return null
	}
}

export const CellShape = memo(CellShapeComponent, areCellsEqual)
