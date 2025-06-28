import { Layer, RectShape } from '@/ui-engine'
import { CellData } from '@/engine'
import { useViewConfig } from '@/providers/game-view'

interface SquareProbabilityFieldProps {
	connectedGroups: CellData[][]
}

export const DebuggingField = ({
	connectedGroups,
}: SquareProbabilityFieldProps) => {
	const {
		cell: { size },
	} = useViewConfig()

	return (
		<Layer name="connected-group" zIndex={50} opacity={0.3}>
			{connectedGroups.map(group => {
				function getRandomColor() {
					const letters = '0123456789ABCDEF'
					let color = '#'
					for (let i = 0; i < 6; i++) {
						color += letters[Math.floor(Math.random() * 16)]
					}
					return color
				}

				const groupColor = getRandomColor()

				return group.map(cell => {
					const x = cell.position.col * size
					const y = cell.position.row * size

					return (
						<RectShape
							width={size}
							height={size}
							key={`${x}-${y}`}
							fillColor={groupColor}
							x={x}
							y={y}
						/>
					)
				})
			})}
		</Layer>
	)
}
