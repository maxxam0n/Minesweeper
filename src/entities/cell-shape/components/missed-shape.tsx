import { LineShape } from '@/shared/canvas'

export const MissedShape = ({
	x,
	y,
	size,
}: {
	x: number
	y: number
	size: number
}) => {
	return (
		<>
			{/* Красный крестик */}
			<LineShape
				x1={x + size * 0.2}
				y1={y + size * 0.2}
				x2={x + size * 0.8}
				y2={y + size * 0.8}
				strokeColor="red"
				lineWidth={3}
				zIndex={2}
			/>
			<LineShape
				x1={x + size * 0.8}
				y1={y + size * 0.2}
				x2={x + size * 0.2}
				y2={y + size * 0.8}
				strokeColor="red"
				lineWidth={3}
				zIndex={2}
			/>
		</>
	)
}
