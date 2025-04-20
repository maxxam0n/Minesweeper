import React from 'react'

interface IMineIconProps {
	isExploded?: boolean
}

export const MineIcon: React.FC<IMineIconProps> = ({ isExploded = false }) => {
	const mineColor = isExploded ? '#f0000f' : '#000000'
	const strokeWidthBase = 3
	const strokeWidthThin = 2

	return (
		<>
			{/* Основной шар мины */}
			<circle cx="15" cy="15" r="7.5" fill={mineColor} />

			{/* Шипы */}
			<line
				x1="15"
				y1="15"
				x2="15"
				y2="4"
				stroke={mineColor}
				strokeWidth={strokeWidthBase}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="26"
				y2="15"
				stroke={mineColor}
				strokeWidth={strokeWidthBase}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="15"
				y2="26"
				stroke={mineColor}
				strokeWidth={strokeWidthBase}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="4"
				y2="15"
				stroke={mineColor}
				strokeWidth={strokeWidthBase}
				strokeLinecap="round"
			/>

			<line
				x1="15"
				y1="15"
				x2="22.9"
				y2="7.1"
				stroke={mineColor}
				strokeWidth={strokeWidthThin}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="22.9"
				y2="22.9"
				stroke={mineColor}
				strokeWidth={strokeWidthThin}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="7.1"
				y2="22.9"
				stroke={mineColor}
				strokeWidth={strokeWidthThin}
				strokeLinecap="round"
			/>
			<line
				x1="15"
				y1="15"
				x2="7.1"
				y2="7.1"
				stroke={mineColor}
				strokeWidth={strokeWidthThin}
				strokeLinecap="round"
			/>

			{/* Блик */}
			<circle cx="12" cy="12" r="2" fill="#ffffff" fillOpacity="0.8" />
		</>
	)
}
