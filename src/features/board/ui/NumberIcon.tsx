import React from 'react'

interface INumberIconProps {
	value: number // Ожидаем число от 1 до 8
}

const numberColors: { [key: number]: string } = {
	1: '#0000FF',
	2: '#008000',
	3: '#FF0000',
	4: '#000080',
	5: '#800000',
	6: '#008080',
	7: '#000000',
	8: '#808080',
}

export const NumberIcon: React.FC<INumberIconProps> = ({ value }) => {
	const color = numberColors[value] || '#000000'
	const fontSize = 20 // Размер шрифта, подбирается под viewBox
	const yOffset = 17 // Смещение по Y для вертикального центрирования (может требовать подстройки)

	if (value < 1 || value > 8) {
		return null
	}

	return (
		<text
			x="50%"
			y={yOffset}
			dominantBaseline="middle" // Важно для вертикального центрирования
			textAnchor="middle" // Важно для горизонтального центрирования
			fontFamily="Digital, monospace"
			fontSize={fontSize}
			fontWeight="normal"
			fill={color}
			style={{ userSelect: 'none' }}
		>
			{value}
		</text>
	)
}
