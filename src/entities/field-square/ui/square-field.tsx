import { MouseEvent } from 'react'
import { Canvas } from '@/ui-engine'
import { CellData, GameParams, Position } from '@/engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { Animation } from '@/shared/lib/use-animations'
import {
	GameInteractionsProps,
	useGameInteractions,
} from '@/shared/lib/use-game-interactions'
import { SquareStaticField } from './square-static-field'
import { SquareGrid } from './square-grid'
import { SquareAnimationField } from './square-animation-field'

interface SquareFieldProps
	extends Omit<GameInteractionsProps, 'getPositionFromEvent'> {
	width: number
	height: number
	params: GameParams
	field: CellData[][]
	animationsList: Animation[]
	removeAnimations: (ids: string[]) => void
}

export const SquareField = ({
	width,
	height,
	field,
	gameOver,
	params,
	animationsList,
	removeAnimations,
	onCellPress,
	onCellRelease,
	onToggleFlag,
}: SquareFieldProps) => {
	const {
		cell: { size },
		animations: { enabled: withAnimations },
	} = useViewConfig()

	const { REVEALED } = useGameColors()

	const { cols, rows } = params

	const getPositionFromEvent = (event: MouseEvent): Position | null => {
		const rect = event.currentTarget.getBoundingClientRect()

		const col = Math.floor((event.clientX - rect.left) / size)
		const row = Math.floor((event.clientY - rect.top) / size)

		if (col < 0 || col >= cols || row < 0 || row >= rows) {
			return null
		}
		return { col, row }
	}

	const interactions = useGameInteractions({
		gameOver,
		getPositionFromEvent,
		onCellPress,
		onCellRelease,
		onToggleFlag,
	})

	return (
		<div
			className="cursor-pointer fit-content"
			onPointerDown={interactions.handlePointerDown}
			onPointerUp={interactions.handlePointerUp}
			onPointerMove={interactions.handlePointerMove}
			onPointerLeave={interactions.handlePointerLeave}
			onContextMenu={interactions.handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={REVEALED}>
				<SquareStaticField
					zIndex={0}
					gameOver={gameOver}
					width={width}
					height={height}
					data={field}
				/>
				{withAnimations && (
					<SquareAnimationField
						zIndex={10}
						animationsList={animationsList}
						onAnimationComplete={removeAnimations}
					/>
				)}
				<SquareGrid
					zIndex={20}
					width={width}
					height={height}
					params={params}
				/>
			</Canvas>
		</div>
	)
}
