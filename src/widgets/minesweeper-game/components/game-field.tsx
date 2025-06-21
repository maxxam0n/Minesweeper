import { Fragment, useMemo } from 'react'
import { CellDrawingData, CellDrawingView, GameParams } from '@/engine'
import { useViewConfig } from '@/providers/game-view-provider'
import { useGameColors } from '@/providers/game-colors-provider'
import { Layer, LineShape, RectShape } from '@/shared/canvas'
import {
	BaseCellShape,
	BevelShape,
	DigitShape,
	FlagShape,
	MineShape,
	MissedShape,
} from '@/entities/cell-shape'
import { useIncrementalRender } from '../lib/use-incremental-render'

interface IFieldProps {
	params: GameParams
	width: number
	height: number
	data: CellDrawingData[][]
}

export const GameField = ({ params, width, height, data }: IFieldProps) => {
	const { REVEALED, CLOSED, BORDER } = useGameColors()
	const { cellSize, borderWidth } = useViewConfig()

	const { cols, rows } = params

	const layersContent = data.flat().reduce(
		(acc, { data, view }) => {
			const cellKey = data.key
			const x = data.position.col * cellSize
			const y = data.position.row * cellSize

			// Слой Solution - рисуем полное отображение открытого поля включая (все цифры и мины)
			if (data.adjacentMines > 0 && !data.isMine) {
				acc.solutionDigitsAndMines.push(
					<DigitShape
						key={`${cellKey}-digit`}
						digit={data.adjacentMines}
						x={x}
						y={y}
					/>
				)
			} else if (data.isMine) {
				acc.solutionDigitsAndMines.push(
					<MineShape key={`${cellKey}-mine`} x={x} y={y} />
				)
			}

			// Слой "mask" - только фаски для нераскрытых клеток
			if (
				view === CellDrawingView.Closed ||
				view === CellDrawingView.Flag ||
				view === CellDrawingView.Missed
			) {
				acc.maskBevels.push(
					<BevelShape key={`${cellKey}-bevel`} x={x} y={y} />
				)
			}

			// 3. Слой "overlay"
			if (view === CellDrawingView.Flag) {
				acc.overlayElements.push(
					<Fragment key={`${cellKey}-flag`}>
						<RectShape width={cellSize} height={cellSize} x={x} y={y} />
						<FlagShape x={x} y={y} />
					</Fragment>
				)
			} else if (view === CellDrawingView.Exploded) {
				acc.overlayElements.push(
					<BaseCellShape
						key={`${cellKey}-exploded`}
						x={x}
						y={y}
						exploded={true}
					>
						<MineShape x={x} y={y} />
					</BaseCellShape>
				)
			} else if (view === CellDrawingView.Missed) {
				acc.overlayElements.push(
					<MissedShape x={x} y={y} key={`${cellKey}-missed`} />
				)
			}

			return acc
		},
		{
			solutionDigitsAndMines: [] as JSX.Element[],
			maskBevels: [] as JSX.Element[],
			overlayElements: [] as JSX.Element[],
		}
	)

	const gridLines = useMemo(() => {
		const lines: JSX.Element[] = []
		const lineColor = BORDER

		// Горизонтальные линии
		for (let i = 0; i <= rows; i++) {
			lines.push(
				<LineShape
					key={`h-line-${i}`}
					x1={0}
					y1={i * cellSize}
					x2={width}
					y2={i * cellSize}
					strokeColor={lineColor}
					lineWidth={borderWidth}
				/>
			)
		}
		// Вертикальные линии
		for (let i = 0; i <= cols; i++) {
			lines.push(
				<LineShape
					key={`v-line-${i}`}
					x1={i * cellSize}
					y1={0}
					x2={i * cellSize}
					y2={height}
					strokeColor={lineColor}
					lineWidth={borderWidth}
				/>
			)
		}
		return lines
	}, [rows, cols, cellSize, width, height, BORDER])

	const solutionBackground = useMemo(
		() => (
			<RectShape
				x={0}
				y={0}
				width={width}
				height={height}
				fillColor={REVEALED}
				zIndex={-1}
			/>
		),
		[width, height, REVEALED]
	)

	const maskBackground = useMemo(
		() => (
			<RectShape
				x={0}
				y={0}
				width={width}
				height={height}
				fillColor={CLOSED}
				zIndex={-1}
			/>
		),
		[width, height, CLOSED]
	)

	const { renderer: maskRenderer } = useIncrementalRender()

	const { renderer: overlayRenderer } = useIncrementalRender()

	if (data.length === 0) return null

	return (
		<>
			{/* Слой 1: Фон открытых клеток + Цифры и Мины */}
			<Layer name="solution" zIndex={0}>
				{solutionBackground}
				{layersContent.solutionDigitsAndMines}
			</Layer>

			{/* Слой 2: Фон закрытых клеток + Фаски */}
			<Layer name="mask" zIndex={1} renderer={maskRenderer}>
				{maskBackground}
				{layersContent.maskBevels}
			</Layer>

			{/* Слой 4: Флажки, взорвавшиеся мины, промахи */}
			<Layer name="overlay" zIndex={2} renderer={overlayRenderer}>
				{layersContent.overlayElements}
			</Layer>

			{/* Слой 3: сетка */}
			<Layer name="grid" zIndex={3}>
				{gridLines}
			</Layer>
		</>
	)
}
