import { GameColorsEnum, useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { TextShape } from '@/shared/canvas'
import { memo } from 'react'
import { BaseCellProps } from '../lib/types'

interface DigitShapeProps extends BaseCellProps {
	digit: number
}

export const DigitShape = memo(({ x, y, digit }: DigitShapeProps) => {
	const colors = useGameColors()
	const { cellSize, font } = useViewConfig()

	const safeFont = font ? `${font}, monospace` : 'monospace'

	return (
		<TextShape
			text={String(digit)}
			x={x + cellSize / 2}
			y={y + cellSize / 2}
			font={`${cellSize * 0.6}px ${safeFont}`}
			textAlign="center"
			textBaseline="middle"
			fillColor={colors[String(digit) as unknown as GameColorsEnum]}
			zIndex={2}
		/>
	)
})
