import { memo, PropsWithChildren } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { RectShape } from '@/ui-engine'
import { BaseCellProps } from '../../lib/types'

interface BaseCellShapeProps extends BaseCellProps, PropsWithChildren {
	open?: boolean
	exploded?: boolean
	missed?: boolean
}

export const BaseCellShape = memo(
	({
		x,
		y,
		open = false,
		exploded = false,
		missed = false,
		children,
	}: BaseCellShapeProps) => {
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
