import { ReactNode } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { RectShape } from '@/shared/canvas'

export const BaseCellShape = ({
	x,
	y,
	size,
	open = false,
	exploded = false,
	missed = false,
	borderWidth,
	children,
}: {
	x: number
	y: number
	size: number
	borderWidth: number
	open?: boolean
	exploded?: boolean
	missed?: boolean
	children?: ReactNode
}) => {
	const { CLOSED, REVEALED, BORDER, EXPLODED_BORDER, EXPLODED, MISSED } =
		useGameColors()

	const color = missed
		? MISSED
		: exploded
		? EXPLODED
		: open
		? REVEALED
		: CLOSED

	const borderColor = exploded ? EXPLODED_BORDER : BORDER

	return (
		<>
			<RectShape
				x={x}
				y={y}
				width={size}
				height={size}
				fillColor={color}
				strokeColor={borderColor}
				lineWidth={borderWidth}
			/>
			{children}
		</>
	)
}
