import { Group, RectShape } from '@/ui-engine'
import { useGameSettings } from '@/providers/game-settings'
import { BaseShapeProps } from '@/shared/types/shape'
import { BevelShape } from './bevel-shape'

interface ProbabilityCellShape extends Omit<BaseShapeProps, 'size'> {
	probability: number
}

export const ProbabilityCell = ({
	probability,
	x = 0,
	y = 0,
}: ProbabilityCellShape) => {
	const {
		settings: {
			cell: { size },
		},
	} = useGameSettings()

	const color = probability > 0 ? 'red' : 'green'
	const opacity = probability > 0 ? probability : 1

	return (
		<Group x={x} y={y} opacity={opacity}>
			<RectShape width={size} height={size} fillColor={color} />
			<BevelShape />
		</Group>
	)
}
