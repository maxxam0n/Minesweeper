import { memo } from 'react'
import { BaseShapeProps } from '@/shared/types/shape'
import { TextShape } from '@/ui-engine'

interface DigitShapeProps extends BaseShapeProps {
	digit: number
	color: string
	font: string
}

export const DigitShape = memo(
	({ x, y, digit, color, font, size }: DigitShapeProps) => {
		const safeFont = font ? `${font}, monospace` : 'monospace'

		return (
			<TextShape
				text={String(digit)}
				x={x + size / 2}
				y={y + size / 2}
				font={`${size * 0.6}px ${safeFont}`}
				textAlign="center"
				textBaseline="middle"
				fillColor={color}
				zIndex={2}
			/>
		)
	}
)
