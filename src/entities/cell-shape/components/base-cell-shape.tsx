import { memo, ReactNode } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { RectShape } from '@/shared/canvas'

export const BaseCellShape = memo(
	({
		x,
		y,
		open = false,
		exploded = false,
		missed = false,
		children,
	}: {
		x: number
		y: number
		open?: boolean
		exploded?: boolean
		missed?: boolean
		children?: ReactNode
	}) => {
		const { cellSize, borderWidth } = useViewConfig()
		const { CLOSED, REVEALED, BORDER, EXPLODED, MISSED } = useGameColors()

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
					width={cellSize}
					height={cellSize}
					fillColor={color}
					strokeColor={BORDER}
					lineWidth={borderWidth}
					zIndex={Number(exploded)}
				/>
				{children}
			</>
		)
	}
)
