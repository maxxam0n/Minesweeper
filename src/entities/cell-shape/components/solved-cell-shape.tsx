import { ReactNode } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { RectShape } from '@/shared/canvas'

export const SolvedCellShape = ({
	x,
	y,
	size,
	children,
	mineProbability,
}: {
	x: number
	y: number
	size: number
	mineProbability: number
	children?: ReactNode
}) => {
	const { EXPLODED } = useGameColors()

	return (
		<>
			<RectShape
				x={x}
				y={y}
				width={size}
				height={size}
				fillColor={EXPLODED}
				opacity={1 - mineProbability}
			/>
			{children}
		</>
	)
}
