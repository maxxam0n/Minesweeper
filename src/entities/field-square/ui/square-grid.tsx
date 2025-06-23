import { useMemo } from 'react'
import { Layer, LineShape } from '@/ui-engine'
import { GameParams } from '@/engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'

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
	const { BORDER } = useGameColors()
	const {
		cell: { size, borderWidth },
	} = useViewConfig()

	const { cols, rows } = params

	const gridLines = useMemo(() => {
		const lines: JSX.Element[] = []
		const lineColor = BORDER

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
	}, [rows, cols, size, width, height, BORDER])

	return (
		<Layer name="grid" zIndex={zIndex}>
			{gridLines}
		</Layer>
	)
}
