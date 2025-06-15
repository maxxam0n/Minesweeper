import { MouseEvent, useCallback, useEffect, useMemo } from 'react'
import { CellDrawingData, Position } from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import { CellShape, ViewConfig } from '@/entities/cell-shape'
import { Canvas } from '@/shared/canvas'

interface IFieldProps {
	drawingData: CellDrawingData[][]
	isGameOver: boolean
	onReveal: (pos: Position) => void
	onToggleFlag: (pos: Position) => void
}

export const GameField = ({
	drawingData,
	isGameOver,
	onReveal,
	onToggleFlag,
}: IFieldProps) => {
	const { REVEALED } = useGameColors()

	// @TODO Добавить возможность настройки, прокинуть в провайдер
	const viewConfig = useMemo<ViewConfig>(
		() => ({
			cellSize: 30,
			font: 'Tektur',
			bevelWidth: 3,
			borderWidth: 1,
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
				{drawingData.flat().map(cell => (
					<CellShape data={cell} key={cell.key} viewConfig={viewConfig} />
				))}
			</Canvas>
		</div>
	)
}
