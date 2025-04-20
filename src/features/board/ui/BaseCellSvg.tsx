import React from 'react'

export interface IBaseCellSvgProps {
	size: number
	variant: 'closed' | 'open' | 'exploded' | 'missed'
	children?: React.ReactNode
	[key: string]: any
}

// Цвета для стилей
const colors = {
	closed: {
		bg: '#c1c1c1', // Основной цвет фона закрытой
		lightBevel: '#ffffff',
		darkBevel1: '#757575',
		darkBevel2: '#5e5e5e',
	},
	open: {
		bg: '#ffffff', // Фон открытой
		border: '#afafaf', // Тонкая граница для эффекта утопленности
	},
	exploded: {
		bg: '#ff6347', // Красный фон для взорванной мины
		border: '#ff6347',
	},
	missed: {
		bg: '#ffcccc',
	},
}

export const BaseCellSvg: React.FC<IBaseCellSvgProps> = ({
	size,
	variant,
	children,
	...props
}) => {
	const renderBackground = () => {
		const bevelWidth = 4 // Ширина фаски (было неявно около 2)
		const innerDim = 30 - bevelWidth
		switch (variant) {
			case 'closed':
			case 'missed':
				const bg = variant == 'closed' ? colors.closed.bg : colors.missed.bg
				return (
					<>
						{/* Основной фон */}
						<rect width="30" height="30" fill={bg} />
						{/* Светлая фаска (сверху и слева) */}
						<polygon
							points={`0,0 30,0 ${innerDim},${bevelWidth} ${bevelWidth},${bevelWidth} ${bevelWidth},${innerDim} 0,30`}
							fill={colors.closed.lightBevel}
							fillOpacity="0.8"
						/>
						{/* Темная фаска (снизу и справа) */}
						<polygon
							points={`30,0 30,30 0,30 ${bevelWidth},${innerDim} ${innerDim},${innerDim} ${innerDim},${bevelWidth}`}
							fill={colors.closed.darkBevel1}
							fillOpacity="0.6"
						/>
					</>
				)
			case 'exploded':
				return (
					<>
						<rect width="30" height="30" fill={colors.exploded.bg} />
						<rect
							x="1"
							y="1"
							width="28"
							height="28"
							fill="none"
							stroke={colors.exploded.border}
							strokeWidth="2"
						/>
					</>
				)
			case 'open':
			default:
				return (
					<>
						<rect width="30" height="30" fill={colors.open.bg} />
						<rect
							x="0"
							y="0"
							width="30"
							height="30"
							fill="none"
							stroke={colors.open.border}
							strokeWidth="1"
						/>
					</>
				)
		}
	}

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 30 30"
			preserveAspectRatio="xMidYMid meet"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{renderBackground()}
			{/* Контент (мина, флаг, цифра) будет рендериться поверх фона */}
			{children}
		</svg>
	)
}
