import { Position } from '@/engine'
import { BaseCellShape, CellRevealEffect } from '@/entities/cell-shape'
import { useViewConfig } from '@/providers/game-view-provider'
import { Layer } from '@/shared/canvas'

interface AnimationFieldProps {
	pressedPositions: Position[]
	activeCellRevealEffects: Array<{ id: string; col: number; row: number }>
	onAnimationComplete: (id: string) => void
}

export const AnimationField = ({
	pressedPositions,
	activeCellRevealEffects,
	onAnimationComplete,
}: AnimationFieldProps) => {
	const { cellSize } = useViewConfig()

	return (
		<Layer name="animations" zIndex={10}>
			{/* Анимации вдавливания */}
			{pressedPositions.map(({ col, row }) => {
				return (
					<BaseCellShape
						key={`press-${col}-${row}`}
						x={col * cellSize}
						y={row * cellSize}
						open={true}
					/>
				)
			})}

			{activeCellRevealEffects.map(animProps => (
				<CellRevealEffect
					key={animProps.id}
					id={animProps.id}
					col={animProps.col}
					row={animProps.row}
					onComplete={onAnimationComplete}
					duration={100}
				/>
			))}
		</Layer>
	)
}
