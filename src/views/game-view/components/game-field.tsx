import { MouseEvent, useCallback, useEffect, useMemo } from 'react'
import { CellDrawingData, Position } from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import { Canvas } from '@/shared/canvas'
import { CellShape } from './cell-shape'

interface IFieldProps {
	drawingData: CellDrawingData[][]
	isGameOver: boolean
	cellSize: number
	onReveal: (pos: Position) => void
	onToggleFlag: (pos: Position) => void
}

export const GameField = ({
	drawingData,
	cellSize,
	isGameOver,
	onReveal,
	onToggleFlag,
}: IFieldProps) => {
	const { REVEALED } = useGameColors()

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
		document.fonts.load('16px Digital')
	}, [])

	if (drawingData.length === 0) return null

	return (
		<div
			className="w-fit"
			onClick={handleCanvasClick}
			onContextMenu={handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={REVEALED}>
				{drawingData.flat().map(cell => (
					<CellShape data={cell} key={cell.key} size={cellSize} />
				))}
			</Canvas>
		</div>
	)
}
