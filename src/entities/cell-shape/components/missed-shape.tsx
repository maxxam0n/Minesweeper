import { useContext } from 'react'
import { LineShape } from '@/shared/canvas'
import { LayerContext } from '../model/layer-context'

export const MissedShape = ({
	x,
	y,
	size,
}: {
	x: number
	y: number
	size: number
}) => {
	const layer = useContext(LayerContext)

	return (
		<>
			{/* Красный крестик */}
			<LineShape
				layer={layer}
				x1={x + size * 0.25}
				y1={y + size * 0.25}
				x2={x + size * 0.75}
				y2={y + size * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
			<LineShape
				layer={layer}
				x1={x + size * 0.75}
				y1={y + size * 0.25}
				x2={x + size * 0.25}
				y2={y + size * 0.75}
				strokeColor="red"
				lineWidth={2}
				zIndex={2}
			/>
		</>
	)
}
