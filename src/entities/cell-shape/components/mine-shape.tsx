import { useGameColors } from '@/providers/game-colors-provider'
import { CircleShape } from '@/shared/canvas'

export const MineShape = ({
	x,
	y,
	size,
}: {
	x: number
	y: number
	size: number
}) => {
	const { MINE } = useGameColors()

	return (
		<CircleShape
			cx={x + size / 2}
			cy={y + size / 2}
			radius={size * 0.3}
			fillColor={MINE}
			zIndex={2}
		/>
	)
}
