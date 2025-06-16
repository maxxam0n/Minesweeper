import {
	MouseEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
} from 'react'
import {
	CellDrawingData,
	CellDrawingView,
	GameStatus,
	Position,
} from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import { CellShape, ViewConfig } from '@/entities/cell-shape'
import { Canvas, Layer } from '@/shared/canvas'

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
			cellSize: 25,
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

			const x = Math.floor((event.clientX - rect.left) / cellSize)
			const y = Math.floor((event.clientY - rect.top) / cellSize)

			if (x < 0 || x >= cols || y < 0 || y >= rows) {
				return null
			}
			return { x, y }
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

	const getSolutionView = (cellData: CellDrawingData): CellDrawingView => {
		if (cellData.isMine) return CellDrawingView.Mine
		if (cellData.adjacentMines > 0) return CellDrawingView.Digit
		return CellDrawingView.Empty
	}

	useEffect(() => {
		document.fonts.load(`16px ${viewConfig.font}`)
	}, [])

	if (drawingData.length === 0) return null

	return (
		<div
			className="w-fit cursor-pointer"
			onClick={handleCanvasClick}
			onContextMenu={handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={REVEALED}>
				<Layer name="solution" zIndex={0}>
					{drawingData.flat().map(cell => (
						<CellShape
							key={`${cell.key}-solution`}
							data={{
								...cell,
								view: getSolutionView(cell),
							}}
							viewConfig={viewConfig}
						/>
					))}
				</Layer>

				<Layer name="mask" zIndex={1} opacity={0.3}>
					{drawingData.flat().map(cell => {
						if ((cell.isMine && isGameLost) || cell.isRevealed) {
							return null
						}
						return (
							<CellShape
								key={`${cell.key}-mask`}
								data={{ ...cell, view: CellDrawingView.Closed }}
								viewConfig={viewConfig}
							/>
						)
					})}
				</Layer>

				<Layer name="overlay" zIndex={2}>
					{drawingData.flat().map(cell => {
						const view = cell.view
						if (
							view === CellDrawingView.Flag ||
							view === CellDrawingView.Exploded ||
							view === CellDrawingView.Missed
						) {
							return (
								<CellShape
									key={`${cell.key}-overlay`}
									data={cell}
									viewConfig={viewConfig}
								/>
							)
						}
						return null
					})}
				</Layer>
				{children}
			</Canvas>
		</div>
	)
}
