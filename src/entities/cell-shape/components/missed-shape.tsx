import { memo } from 'react'
import { useViewConfig } from '@/providers/game-view-provider'
import { LineShape } from '@/shared/canvas'
import { BaseCellProps } from '../lib/types'

export const MissedShape = memo(({ x, y }: BaseCellProps) => {
	const { cellSize } = useViewConfig()

	return (
		<>
			{/* Красный крестик */}
			<LineShape
				x1={x + cellSize * 0.25}
				y1={y + cellSize * 0.25}
				x2={x + cellSize * 0.75}
				y2={y + cellSize * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
			<LineShape
				x1={x + cellSize * 0.75}
				y1={y + cellSize * 0.25}
				x2={x + cellSize * 0.25}
				y2={y + cellSize * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
		</>
	)
})
