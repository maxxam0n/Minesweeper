import { memo } from 'react'
import { CellDrawingData, CellDrawingView } from '@/engine'
import { ViewConfig } from '../lib/types'
import { getLayer } from '../lib/get-layer'
import { LayerContext } from '../model/layer-context'
import { BevelShape } from './bevel-shape'
import { BaseCellShape } from './base-cell-shape'
import { DigitShape } from './digit-shape'
import { FlagShape } from './flag-shape'
import { MineShape } from './mine-shape'
import { MissedShape } from './missed-shape'

interface CellProps {
	data: CellDrawingData
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

	const layer = getLayer(view)

	let CellShape = null

	switch (view) {
		case CellDrawingView.Closed:
			CellShape = (
				<BevelShape x={x} y={y} size={cellSize} width={bevelWidth}>
					<BaseCellShape
						x={x}
						y={y}
						size={cellSize}
						borderWidth={borderWidth}
					/>
				</BevelShape>
			)
			break

		case CellDrawingView.Empty:
			CellShape = (
				<BaseCellShape
					x={x}
					y={y}
					size={cellSize}
					open={true}
					borderWidth={borderWidth}
				/>
			)
			break

		case CellDrawingView.Digit:
			CellShape = (
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
			break

		case CellDrawingView.Flag:
			CellShape = (
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
			break

		case CellDrawingView.Mine:
			CellShape = (
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
			break

		case CellDrawingView.Exploded:
			CellShape = (
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
			break

		case CellDrawingView.Missed:
			CellShape = (
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
			break

		default:
			CellShape = null
	}

	return (
		<LayerContext.Provider value={layer}>{CellShape}</LayerContext.Provider>
	)
}

export const CellShape = memo(CellShapeComponent, areCellsEqual)
