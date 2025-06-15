import { ReactNode, useContext } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { PolygonShape } from '@/shared/canvas'
import { LayerContext } from '../model/layer-context'

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
	const layer = useContext(LayerContext)

	const { LIGHT_BEVEL, DARK_BEVEL } = useGameColors()

	return (
		<>
			{/* Светлая грань сверху и слева */}
			<PolygonShape
				layer={layer}
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
				layer={layer}
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
