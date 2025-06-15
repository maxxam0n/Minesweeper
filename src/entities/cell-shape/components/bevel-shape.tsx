import { ReactNode } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { PolygonShape } from '@/shared/canvas'

export const BevelShape = ({
	children,
	size,
	width,
	x,
	y,
}: {
	x: number
	y: number
	size: number
	width: number
	children?: ReactNode
}) => {
	const { LIGHT_BEVEL, DARK_BEVEL } = useGameColors()

	return (
		<>
			{/* Светлая грань сверху и слева */}
			<PolygonShape
				points={[
					{ x, y },
					{ x: x + size, y },
					{ x: x + size - width, y: y + width },
					{ x: x + width, y: y + width },
					{ x: x + width, y: y + size - width },
					{ x, y: y + size },
				]}
				closed={true}
				fillColor={LIGHT_BEVEL}
				zIndex={1}
			/>
			{/* Темная грань снизу и справа */}
			<PolygonShape
				points={[
					{ x: x + size, y: y + size },
					{ x, y: y + size },
					{ x: x + width, y: y + size - width },
					{ x: x + size - width, y: y + size - width },
					{ x: x + size - width, y: y + width },
					{ x: x + size, y },
				]}
				fillColor={DARK_BEVEL}
				closed={true}
				zIndex={1}
			/>
			{children}
		</>
	)
}
