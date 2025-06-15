import { ReactNode, useContext } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { RectShape } from '@/shared/canvas'
import { LayerContext } from '../model/layer-context'

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
	const { CLOSED, REVEALED, BORDER, EXPLODED, MISSED } = useGameColors()

	const layer = useContext(LayerContext)

	const color = missed
		? MISSED
		: exploded
		? EXPLODED
		: open
		? REVEALED
		: CLOSED

	return (
		<>
			<RectShape
				x={x}
				y={y}
				width={size}
				height={size}
				fillColor={color}
				strokeColor={BORDER}
				lineWidth={borderWidth}
				layer={layer}
				zIndex={Number(exploded)}
			/>
			{children}
		</>
	)
}
