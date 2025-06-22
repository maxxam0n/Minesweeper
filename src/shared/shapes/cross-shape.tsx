import { memo } from 'react'
import { BaseShapeProps } from '@/shared/types/shape'
import { LineShape } from '@/ui-engine'

export const MissedShape = memo(({ x, y, size }: BaseShapeProps) => {
	return (
		<>
			{/* Красный крестик */}
			<LineShape
				x1={x + size * 0.25}
				y1={y + size * 0.25}
				x2={x + size * 0.75}
				y2={y + size * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
			<LineShape
				x1={x + size * 0.75}
				y1={y + size * 0.25}
				x2={x + size * 0.25}
				y2={y + size * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
		</>
	)
})
