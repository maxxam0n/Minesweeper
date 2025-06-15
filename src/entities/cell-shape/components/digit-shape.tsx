import { useContext } from 'react'
import { GameColorsEnum, useGameColors } from '@/providers/game-colors-provider'
import { TextShape } from '@/shared/canvas'
import { LayerContext } from '../model/layer-context'

export const DigitShape = ({
	x,
	y,
	size,
	font,
	digit,
}: {
	x: number
	y: number
	size: number
	font: string
	digit: number
}) => {
	const layer = useContext(LayerContext)

	const colors = useGameColors()

	return (
		<TextShape
			text={String(digit)}
			layer={layer}
			x={x + size / 2}
			y={y + size / 2}
			font={`${size * 0.6}px ${font}, monospace`}
			textAlign="center"
			textBaseline="middle"
			fillColor={colors[String(digit) as unknown as GameColorsEnum]}
			zIndex={2}
		/>
	)
}
