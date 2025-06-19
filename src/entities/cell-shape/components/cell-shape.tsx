import { memo } from 'react'
import { CellDrawingView } from '@/engine'
import { useViewConfig } from '@/providers/game-view-provider'
import { CellData } from '../lib/types'
import { BevelShape } from './bevel-shape'
import { BaseCellShape } from './base-cell-shape'
import { DigitShape } from './digit-shape'
import { FlagShape } from './flag-shape'
import { MineShape } from './mine-shape'
import { MissedShape } from './missed-shape'

interface CellProps {
	data: CellData
}

const areCellsEqual = (
	prevProps: Readonly<CellProps>,
	nextProps: Readonly<CellProps>
): boolean => {
	return prevProps.data.view === nextProps.data.view
}

const CellShapeComponent = ({ data }: CellProps) => {
	const { position, view, adjacentMines } = data
	const { cellSize } = useViewConfig()

	// Рассчитываем позицию ячейки на холсте
	const x = position.col * cellSize
	const y = position.row * cellSize

	switch (view) {
		case CellDrawingView.Closed:
			return (
				<BevelShape x={x} y={y}>
					<BaseCellShape x={x} y={y} />
				</BevelShape>
			)

		case CellDrawingView.Empty:
			return <BaseCellShape x={x} y={y} open={true} />

		case CellDrawingView.Digit:
			return (
				<BaseCellShape x={x} y={y} open={true}>
					<DigitShape digit={adjacentMines} x={x} y={y} />
				</BaseCellShape>
			)

		case CellDrawingView.Flag:
			return (
				<BevelShape x={x} y={y}>
					<BaseCellShape x={x} y={y}>
						<FlagShape x={x} y={y} />
					</BaseCellShape>
				</BevelShape>
			)

		case CellDrawingView.Mine:
			return (
				<BaseCellShape x={x} y={y} open={true}>
					<MineShape x={x} y={y} />
				</BaseCellShape>
			)

		case CellDrawingView.Exploded:
			return (
				<BaseCellShape x={x} y={y} exploded={true}>
					<MineShape x={x} y={y} />
				</BaseCellShape>
			)

		case CellDrawingView.Missed:
			return (
				<BevelShape x={x} y={y}>
					<BaseCellShape x={x} y={y} missed={true}>
						<MissedShape x={x} y={y} />
					</BaseCellShape>
				</BevelShape>
			)

		default:
			return null
	}
}

export const CellShape = memo(CellShapeComponent, areCellsEqual)
