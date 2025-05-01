import { useFieldColors } from '../hooks/useFieldColors'
import { FieldColorsEnum } from '../model/types'

interface INumberIconProps {
	value: number // Ожидаем число от 1 до 8
}

export const NumberIcon = ({ value }: INumberIconProps) => {
	const colors = useFieldColors()

	const color = colors[value as unknown as FieldColorsEnum] || '#000000'
	const fontSize = 20 // Размер шрифта, подбирается под viewBox
	const yOffset = 17 // Смещение по Y для вертикального центрирования (может требовать подстройки)

	if (value < 1 || value > 8) {
		return null
	}

	return (
		<text
			className="select-none"
			fill={color}
			fontSize={fontSize}
			fontFamily="Digital, monospace"
			fontWeight="normal"
			x="50%"
			textAnchor="middle" // Важно для горизонтального центрирования
			y={yOffset}
			dominantBaseline="middle" // Важно для вертикального центрирования
		>
			{value}
		</text>
	)
}
