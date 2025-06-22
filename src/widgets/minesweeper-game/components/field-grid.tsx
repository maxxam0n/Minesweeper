import { useMemo } from 'react'
import { GameParams } from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { Layer, LineShape } from '@/shared/canvas'

interface FieldGridProps {
	zIndex: number
	params: GameParams
	width: number
	height: number
}

export const FieldGrid = ({
	params,
	width,
	height,
	zIndex,
}: FieldGridProps) => {
	const { BORDER } = useGameColors()
	const { cellSize, borderWidth } = useViewConfig()

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
					y1={i * cellSize}
					x2={width}
					y2={i * cellSize}
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
					x1={i * cellSize}
					y1={0}
					x2={i * cellSize}
					y2={height}
					strokeColor={lineColor}
					lineWidth={borderWidth}
				/>
			)
		}
		return lines
	}, [rows, cols, cellSize, width, height, BORDER])

	return (
		<Layer name="grid" zIndex={zIndex}>
			{gridLines}
		</Layer>
	)
}
