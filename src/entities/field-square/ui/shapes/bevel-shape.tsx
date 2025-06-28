import { memo } from 'react'
import { PolygonShape } from '@/ui-engine'
import { useGameSettings } from '@/providers/game-settings'
import { BaseShapeProps } from '@/shared/types/shape'

interface BevelShapeProps extends Omit<BaseShapeProps, 'size'> {}

export const BevelShape = memo(({ x = 0, y = 0 }: BevelShapeProps) => {
	const {
		settings: {
			cell: { size, bevelWidth },
			colors: { lightBevel, darkBevel },
		},
	} = useGameSettings()

	return (
		<>
			{/* Светлая грань сверху и слева */}
			<PolygonShape
				points={[
					{ x, y },
					{ x: x + size, y },
					{ x: x + size - bevelWidth, y: y + bevelWidth },
					{ x: x + bevelWidth, y: y + bevelWidth },
					{ x: x + bevelWidth, y: y + size - bevelWidth },
					{ x, y: y + size },
				]}
				closed={true}
				fillColor={lightBevel}
				zIndex={1}
			/>
			{/* Темная грань снизу и справа */}
			<PolygonShape
				points={[
					{ x: x + size, y: y + size },
					{ x, y: y + size },
					{ x: x + bevelWidth, y: y + size - bevelWidth },
					{
						x: x + size - bevelWidth,
						y: y + size - bevelWidth,
					},
					{ x: x + size - bevelWidth, y: y + bevelWidth },
					{ x: x + size, y },
				]}
				fillColor={darkBevel}
				closed={true}
				zIndex={1}
			/>
		</>
	)
})
