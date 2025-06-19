import { MouseEvent, PropsWithChildren, useCallback, useMemo } from 'react'
import {
	CellDrawingData,
	CellDrawingView,
	GameStatus,
	Position,
} from '@/engine'
import { useViewConfig } from '@/providers/game-view-provider'
import { useGameColors } from '@/providers/game-colors-provider'
import {
	BaseCellShape,
	BevelShape,
	DigitShape,
	FlagShape,
	MineShape,
	MissedShape,
} from '@/entities/cell-shape'
import { Canvas, Layer, LineShape, RectShape } from '@/shared/canvas'
import { useMaskRender } from '../lib/use-mask-render'

interface IFieldProps extends PropsWithChildren {
	drawingData: CellDrawingData[][]
	gameStatus: GameStatus
	onReveal: (pos: Position) => void
	onToggleFlag: (pos: Position) => void
}

export const GameField = ({
	drawingData,
	gameStatus,
	onReveal,
	onToggleFlag,
	children,
}: IFieldProps) => {
	const { REVEALED, CLOSED, BORDER } = useGameColors()
	const { cellSize, borderWidth } = useViewConfig()

	const isGameLost = gameStatus === GameStatus.Lost
	const isGameOver = isGameLost || gameStatus === GameStatus.Won

	const rows = drawingData.length
	const cols = drawingData[0].length

	const [height, width] = useMemo(
		() => [rows * cellSize, cols * cellSize],
		[rows, cols]
	)

	const getCellPositionFromMouseEvent = useCallback(
		(event: MouseEvent): Position | null => {
			const rect = event.currentTarget.getBoundingClientRect()

			const col = Math.floor((event.clientX - rect.left) / cellSize)
			const row = Math.floor((event.clientY - rect.top) / cellSize)

			if (col < 0 || col >= cols || row < 0 || row >= rows) {
				return null
			}
			return { col, row }
		},
		[cellSize, rows, cols]
	)

	const handleCanvasClick = useCallback(
		(event: MouseEvent) => {
			if (isGameOver) return
			const pos = getCellPositionFromMouseEvent(event)
			if (pos) onReveal(pos)
		},
		[isGameOver, onReveal, getCellPositionFromMouseEvent]
	)

	const handleCanvasRightClick = useCallback(
		(event: MouseEvent) => {
			event.preventDefault()
			if (isGameOver) return
			const pos = getCellPositionFromMouseEvent(event)
			if (pos) onToggleFlag(pos)
		},
		[isGameOver, onToggleFlag, getCellPositionFromMouseEvent]
	)

	const layersContent = useMemo(() => {
		const solutionDigitsAndMines: (JSX.Element | null)[] = []
		const maskBevels: (JSX.Element | null)[] = []
		const overlayElements: (JSX.Element | null)[] = []

		drawingData.flat().forEach(({ data, view }) => {
			const cellKey = data.key
			const x = data.position.col * cellSize
			const y = data.position.row * cellSize
			// Слой Solution - рисуем полное отображение открытого поля включая (все цифры и мины)
			if (data.adjacentMines > 0 && !data.isMine) {
				solutionDigitsAndMines.push(
					<DigitShape
						key={`${cellKey}-digit`}
						digit={data.adjacentMines}
						x={x}
						y={y}
					/>
				)
			} else if (data.isMine) {
				solutionDigitsAndMines.push(
					<MineShape key={`${cellKey}-mine`} x={x} y={y} />
				)
			} else solutionDigitsAndMines.push(null)

			// Слой "mask" - только фаски для нераскрытых клеток
			if (
				view === CellDrawingView.Closed ||
				view === CellDrawingView.Flag ||
				view === CellDrawingView.Missed
			) {
				maskBevels.push(<BevelShape key={`${cellKey}-bevel`} x={x} y={y} />)
			} else maskBevels.push(null)

			// 3. Слой "overlay"
			if (view === CellDrawingView.Flag) {
				overlayElements.push(
					<FlagShape key={`${cellKey}-flag`} x={x} y={y} />
				)
			} else if (view === CellDrawingView.Exploded) {
				overlayElements.push(
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
				overlayElements.push(
					<MissedShape x={x} y={y} key={`${cellKey}-missed`} />
				)
			} else {
				overlayElements.push(null)
			}
		})

		return {
			solutionDigitsAndMines,
			maskBevels,
			overlayElements,
		}
	}, [drawingData, cellSize])

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

	const { maskRenderer } = useMaskRender()

	if (drawingData.length === 0) return null

	return (
		<div
			className="w-fit cursor-pointer"
			onClick={handleCanvasClick}
			onContextMenu={handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={REVEALED}>
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
				<Layer name="overlay" zIndex={2}>
					{layersContent.overlayElements}
				</Layer>

				{/* Слой 3: сетка */}
				<Layer name="grid" zIndex={3}>
					{gridLines}
				</Layer>

				{children}
			</Canvas>
		</div>
	)
}
