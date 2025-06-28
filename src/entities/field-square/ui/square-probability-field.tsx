import { MineProbability } from '@/engine'
import { Layer } from '@/ui-engine'
import { useGameSettings } from '@/providers/game-settings'
import { ProbabilityCell } from './shapes/probability-cell-shape'

interface SquareProbabilityFieldProps {
	zIndex: number
	probabilities: MineProbability[]
}

export const SquareProbabilityField = ({
	zIndex,
	probabilities,
}: SquareProbabilityFieldProps) => {
	const {
		settings: {
			cell: { size },
		},
	} = useGameSettings()

	return (
		<Layer name="probabilities" zIndex={zIndex} opacity={0.3}>
			{probabilities.map(probability => {
				const { position, value } = probability
				const x = position.col * size
				const y = position.row * size

				return (
					<ProbabilityCell
						key={`${x}-${y}`}
						probability={value}
						x={x}
						y={y}
					/>
				)
			})}
		</Layer>
	)
}
