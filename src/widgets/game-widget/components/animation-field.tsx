import { Position } from '@/engine'
import { BaseCellShape } from '@/entities/cell-shape'
import { useViewConfig } from '@/providers/game-view-provider'
import { Layer } from '@/shared/canvas'

interface AnimationFieldProps {
	pressedPositions: Position[]
}

export const AnimationField = ({ pressedPositions }: AnimationFieldProps) => {
	const { cellSize } = useViewConfig()

	return (
		<Layer name="animations" zIndex={10}>
			{pressedPositions.length > 0 &&
				pressedPositions.map(pos => {
					return (
						<BaseCellShape
							x={pos.col * cellSize}
							y={pos.row * cellSize}
							open={true}
						/>
					)
				})}
		</Layer>
	)
}
