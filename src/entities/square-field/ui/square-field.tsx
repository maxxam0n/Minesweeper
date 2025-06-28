import { MouseEvent } from 'react'
import { Canvas } from '@/ui-engine'
import { CellData, MineProbability, Position } from '@/engine'
import { useFieldProps } from '@/providers/field-props'
import { useGameSettings } from '@/providers/game-settings'
import { Animation } from '@/shared/lib/use-animations'
import { useGameInteractions } from '@/shared/lib/use-game-interactions'
import { SquareStaticField } from './square-static-field'
import { SquareGrid } from './square-grid'
import { SquareAnimationField } from './square-animation-field'
import { SquareProbabilityField } from './square-probability-field'
import { DebuggingField } from './debugging-field'

interface SquareFieldProps {
	field: CellData[][]
	animationsList?: Animation[]
	probabilities?: MineProbability[]
	connectedRegions?: CellData[][]
}

export const SquareField = ({
	field,
	animationsList = [],
	probabilities = [],
	connectedRegions = [],
}: SquareFieldProps) => {
	const {
		settings: {
			cell: { size },
			animations: { enabled: animationsEnabled },
			colors: { revealed },
		},
	} = useGameSettings()

	const {
		gameOver,
		height,
		params,
		width,
		interactions,
		showConnectedRegions,
		showProbabilities,
		removeAnimations,
	} = useFieldProps()

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

	const gameInteractions = useGameInteractions({
		gameOver,
		getPositionFromEvent,
		...interactions,
	})

	return (
		<div
			className="cursor-pointer fit-content"
			onPointerDown={gameInteractions.handlePointerDown}
			onPointerUp={gameInteractions.handlePointerUp}
			onPointerMove={gameInteractions.handlePointerMove}
			onPointerLeave={gameInteractions.handlePointerLeave}
			onContextMenu={gameInteractions.handleCanvasRightClick}
		>
			<Canvas width={width} height={height} bgColor={revealed}>
				<SquareStaticField
					zIndex={0}
					gameOver={gameOver}
					width={width}
					height={height}
					data={field}
				/>
				{animationsEnabled && (
					<SquareAnimationField
						zIndex={10}
						animationsList={animationsList}
						onAnimationComplete={removeAnimations}
					/>
				)}
				{showProbabilities && (
					<SquareProbabilityField
						zIndex={15}
						probabilities={probabilities}
					/>
				)}
				{showConnectedRegions && (
					<DebuggingField connectedGroups={connectedRegions} />
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
