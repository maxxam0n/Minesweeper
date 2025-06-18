import { MouseEvent, PropsWithChildren, useCallback, useMemo } from 'react'
import {
	CellData,
	CellDrawingData,
	CellDrawingView,
	GameStatus,
	Position,
} from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import { CellShape, ViewConfig } from '@/entities/cell-shape'
import { Canvas, Layer } from '@/shared/canvas'
import { useMaskRender } from '../hooks/use-mask-render'

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
	const { REVEALED } = useGameColors()

	const isGameLost = gameStatus === GameStatus.Lost
	const isGameOver = isGameLost || gameStatus === GameStatus.Won

	// @TODO Добавить возможность настройки, прокинуть в провайдер
	const viewConfig = useMemo<ViewConfig>(
		() => ({
			cellSize: 30,
			font: 'Tektur',
			bevelWidth: 3,
			borderWidth: 2,
		}),
		[]
	)

	const cellSize = viewConfig.cellSize

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

	const getSolutionView = (data: CellData): CellDrawingView => {
		if (data.isMine) return CellDrawingView.Mine
		if (data.adjacentMines > 0) return CellDrawingView.Digit
		return CellDrawingView.Empty
	}

	if (drawingData.length === 0) return null

	const layersContent = useMemo(() => {
		const solutionShapes: JSX.Element[] = []
		const maskShapes: JSX.Element[] = []
		const overlayShapes: JSX.Element[] = []

		drawingData.flat().forEach(({ data, view }) => {
			const cellKey = data.key

			// 1. Слой "solution" - рисуется всегда
			solutionShapes.push(
				<CellShape
					key={`${cellKey}-solution`}
					data={{ ...data, view: getSolutionView(data) }}
					viewConfig={viewConfig}
				/>
			)

			// 2. Слой "mask"
			if (!((data.isMine && isGameLost) || data.isRevealed)) {
				maskShapes.push(
					<CellShape
						key={`${cellKey}-mask`}
						data={{ ...data, view: CellDrawingView.Closed }}
						viewConfig={viewConfig}
					/>
				)
			}

			// 3. Слой "overlay"
			if (
				view === CellDrawingView.Flag ||
				view === CellDrawingView.Exploded ||
				view === CellDrawingView.Missed
			) {
				overlayShapes.push(
					<CellShape
						key={`${cellKey}-overlay`}
						data={{ ...data, view }}
						viewConfig={viewConfig}
					/>
				)
			}
		})

		return { solutionShapes, maskShapes, overlayShapes }
	}, [drawingData, isGameLost, viewConfig])

	const { maskRenderer } = useMaskRender()

	return (
		<div
			className="w-fit cursor-pointer"
			onClick={handleCanvasClick}
			onContextMenu={handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={REVEALED}>
				<Layer name="solution" zIndex={0}>
					{layersContent.solutionShapes}
				</Layer>

				<Layer name="mask" zIndex={1} opacity={0.3} renderer={maskRenderer}>
					{layersContent.maskShapes}
				</Layer>

				<Layer name="overlay" zIndex={2}>
					{layersContent.overlayShapes}
				</Layer>
				{children}
			</Canvas>
		</div>
	)
}
