import { useMemo } from 'react'
import { Layer, LineShape } from '@/ui-engine'
import { GameParams } from '@/engine'
import { useGameSettings } from '@/providers/game-settings'

interface SquareGridProps {
	zIndex: number
	params: GameParams
	width: number
	height: number
}

export const SquareGrid = ({
	params,
	width,
	height,
	zIndex,
}: SquareGridProps) => {
	const {
		settings: {
			cell: { size, borderWidth },
			colors: { border },
		},
	} = useGameSettings()

	const { cols, rows } = params

	const gridLines = useMemo(() => {
		const lines: JSX.Element[] = []
		const lineColor = border

		// Горизонтальные линии
		for (let i = 0; i <= rows; i++) {
			lines.push(
				<LineShape
					key={`h-line-${i}`}
					x1={0}
					y1={i * size}
					x2={width}
					y2={i * size}
					strokeColor={lineColor}
					lineWidth={borderWidth}
				/>
			)
		}
		// Вертикальные линии
		for (let i = 0; i <= cols; i++) {
			lines.push(
				<LineShape
					key={`v-line-${i}`}
					x1={i * size}
					y1={0}
					x2={i * size}
					y2={height}
					strokeColor={lineColor}
					lineWidth={borderWidth}
				/>
			)
		}
		return lines
	}, [rows, cols, size, width, height, border])

	return (
		<Layer name="grid" zIndex={zIndex}>
			{gridLines}
		</Layer>
	)
}
