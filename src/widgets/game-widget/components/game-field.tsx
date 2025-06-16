import {
	MouseEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
} from 'react'
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
					{drawingData.flat().map(({ data }) => (
						<CellShape
							key={`${data.key}-solution`}
							data={{
								...data,
								view: getSolutionView(data),
							}}
							viewConfig={viewConfig}
						/>
					))}
				</Layer>

				<Layer name="mask" zIndex={1} opacity={0.3}>
					{drawingData.flat().map(({ data }) => {
						if ((data.isMine && isGameLost) || data.isRevealed) {
							return null
						}
						return (
							<CellShape
								key={`${data.key}-mask`}
								data={{ ...data, view: CellDrawingView.Closed }}
								viewConfig={viewConfig}
							/>
						)
					})}
				</Layer>

				<Layer name="overlay" zIndex={2}>
					{drawingData.flat().map(({ data, view }) => {
						if (
							view === CellDrawingView.Flag ||
							view === CellDrawingView.Exploded ||
							view === CellDrawingView.Missed
						) {
							return (
								<CellShape
									key={`${data.key}-overlay`}
									data={{ ...data, view }}
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
