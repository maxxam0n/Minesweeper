import { useGameColors } from '@/providers/game-colors-provider'
import { LineShape, PolygonShape } from '@/shared/canvas'

export const FlagShape = ({
	x,
	y,
	size,
}: {
	x: number
	y: number
	size: number
}) => {
	const { FLAG_SHAFT, FLAG } = useGameColors()

	return (
		<>
			{/* Древко флага */}
			<LineShape
				x1={x + size / 2}
				y1={y + size * 0.2}
				x2={x + size / 2}
				y2={y + size * 0.8}
				strokeColor={FLAG_SHAFT}
				lineWidth={2}
				zIndex={3}
			/>
			{/* Сам флаг */}
			<PolygonShape
				points={[
					{ x: x + size / 2, y: y + size * 0.2 },
					{ x: x + size / 2, y: y + size * 0.5 },
					{ x: x + size * 0.2, y: y + size * 0.35 },
				]}
				closed={true}
				fillColor={FLAG}
				zIndex={4}
			/>
		</>
	)
}
