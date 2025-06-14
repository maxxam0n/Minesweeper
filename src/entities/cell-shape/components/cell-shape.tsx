import { memo } from 'react'
import { CellDrawingData, CellDrawingView } from '@/engine'
import { ViewConfig } from '../lib/types'
import { BevelShape } from './bevel-shape'
import { BaseCellShape } from './base-cell-shape'
import { DigitShape } from './digit-shape'
import { FlagShape } from './flag-shape'
import { MineShape } from './mine-shape'
import { MissedShape } from './missed-shape'

interface CellProps {
	data: CellDrawingData
	size: number
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

const CellShapeComponent = ({ data, size, viewConfig }: CellProps) => {
	const { position, view, adjacentMines } = data
	const { bevelWidth = 3, borderWidth = 1, font = 'Digital' } = viewConfig

	// Рассчитываем позицию ячейки на холсте
	const x = position.x * size
	const y = position.y * size

	switch (view) {
		case CellDrawingView.Closed:
			return (
				<BevelShape x={x} y={y} size={size} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={size}
						borderWidth={borderWidth}
					/>
				</BevelShape>
			)

		case CellDrawingView.Empty:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={size}
					open={true}
					borderWidth={borderWidth}
				/>
			)

		case CellDrawingView.Digit:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={size}
					open={true}
					borderWidth={borderWidth}
				>
					<DigitShape
						digit={adjacentMines}
						x={x}
						y={y}
						size={size}
						font={font}
					/>
				</BaseCellShape>
			)

		case CellDrawingView.Flag:
			return (
				<BevelShape x={x} y={y} size={size} width={bevelWidth}>
					<BaseCellShape x={x} y={y} size={size} borderWidth={borderWidth}>
						<FlagShape x={x} y={y} size={size} />
					</BaseCellShape>
				</BevelShape>
			)

		case CellDrawingView.Mine:
			return (
				<BaseCellShape x={x} y={y} size={size} borderWidth={borderWidth}>
					<MineShape x={x} y={y} size={size} />
				</BaseCellShape>
			)

		case CellDrawingView.Exploded:
			return (
				<BaseCellShape
					x={x}
					y={y}
					size={size}
					borderWidth={borderWidth}
					exploded={true}
				>
					<MineShape x={x} y={y} size={size} />
				</BaseCellShape>
			)

		case CellDrawingView.Missed:
			return (
				<BevelShape x={x} y={y} size={size} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={size}
						missed={true}
						borderWidth={borderWidth}
					>
						<MissedShape x={x} y={y} size={size} />
					</BaseCellShape>
				</BevelShape>
			)

		default:
			return null
	}
}

export const CellShape = memo(CellShapeComponent, areCellsEqual)
