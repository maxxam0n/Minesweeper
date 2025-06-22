import { MouseEvent, PointerEvent, PropsWithChildren, useRef } from 'react'
import { GameParams, Position } from '@/engine'
import { useViewConfig } from '@/providers/game-view-provider'

interface GameFieldHandlersProps extends PropsWithChildren {
	className: string
	gameOver: boolean
	params: GameParams
	onToggleFlag: (pos: Position) => void
	onCellPress: (pos: Position) => void
	onCellRelease: (isClick: boolean, pos?: Position) => void
}

export const GameFieldHandlers = ({
	gameOver,
	params,
	children,
	className,
	onCellPress,
	onCellRelease,
	onToggleFlag,
}: GameFieldHandlersProps) => {
	const { cellSize } = useViewConfig()
	const { cols, rows } = params

	const pressedPosition = useRef<Position | null>(null)

	const getCellPositionFromMouseEvent = (
		event: MouseEvent
	): Position | null => {
		const rect = event.currentTarget.getBoundingClientRect()

		const col = Math.floor((event.clientX - rect.left) / cellSize)
		const row = Math.floor((event.clientY - rect.top) / cellSize)

		if (col < 0 || col >= cols || row < 0 || row >= rows) {
			return null
		}
		return { col, row }
	}

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (gameOver || event.button !== 0) return // Только левая кнопка
		const pos = getCellPositionFromMouseEvent(event)
		if (pos) {
			pressedPosition.current = pos
			onCellPress(pos)
		}
	}

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (gameOver || !pressedPosition.current) return
		const pos = getCellPositionFromMouseEvent(event)

		if (pos) {
			const { col: prevCol, row: prevRow } = pressedPosition.current

			if (pos.col !== prevCol || pos.row !== prevRow) {
				onCellRelease(false)
				pressedPosition.current = pos
				onCellPress(pos)
			}
		} else {
			// Курсор ушел за пределы поля с зажатой кнопкой
			onCellRelease(false)
			pressedPosition.current = null
		}
	}

	const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
		if (gameOver || event.button !== 0) return

		const releasedPos = getCellPositionFromMouseEvent(event)

		if (releasedPos) {
			// Если отпустили на той же клетке - это клик
			const { col, row } = pressedPosition.current ?? {}
			const isClick = releasedPos.col === col && releasedPos.row === row
			onCellRelease(isClick, isClick ? releasedPos : undefined)
		}
		pressedPosition.current = null
	}

	const handlePointerLeave = () => {
		if (gameOver) return
		if (pressedPosition.current) {
			onCellRelease(false)
			pressedPosition.current = null
		}
	}

	const handleCanvasRightClick = (event: MouseEvent) => {
		event.preventDefault()
		if (gameOver) return
		const pos = getCellPositionFromMouseEvent(event)
		if (pos) onToggleFlag(pos)
	}
	return (
		<div
			className={className}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onContextMenu={handleCanvasRightClick}
		>
			{children}
		</div>
	)
}
