import { memo, PropsWithChildren } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { PolygonShape } from '@/ui-engine'
import { useViewConfig } from '@/providers/game-view-provider'
import { BaseCellProps } from '../../lib/types'

interface BevelShapeProps extends BaseCellProps, PropsWithChildren {}

export const BevelShape = memo(({ children, x, y }: BevelShapeProps) => {
	const { cellSize, bevelWidth } = useViewConfig()
	const { LIGHT_BEVEL, DARK_BEVEL } = useGameColors()

	return (
		<>
			{/* Светлая грань сверху и слева */}
			<PolygonShape
				points={[
					{ x, y },
					{ x: x + cellSize, y },
					{ x: x + cellSize - bevelWidth, y: y + bevelWidth },
					{ x: x + bevelWidth, y: y + bevelWidth },
					{ x: x + bevelWidth, y: y + cellSize - bevelWidth },
					{ x, y: y + cellSize },
				]}
				closed={true}
				fillColor={LIGHT_BEVEL}
				zIndex={1}
			/>
			{/* Темная грань снизу и справа */}
			<PolygonShape
				points={[
					{ x: x + cellSize, y: y + cellSize },
					{ x, y: y + cellSize },
					{ x: x + bevelWidth, y: y + cellSize - bevelWidth },
					{
						x: x + cellSize - bevelWidth,
						y: y + cellSize - bevelWidth,
					},
					{ x: x + cellSize - bevelWidth, y: y + bevelWidth },
					{ x: x + cellSize, y },
				]}
				fillColor={DARK_BEVEL}
				closed={true}
				zIndex={1}
			/>
			{children}
		</>
	)
})
