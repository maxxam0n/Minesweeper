import React from 'react'
import { useFieldColors } from '../hooks/useFieldColors'

export interface IBaseCellSvgProps {
	size: number
	variant: 'closed' | 'open' | 'exploded' | 'missed'
	children?: React.ReactNode
	bevelWidth?: number
	[key: string]: any
}

export const BaseCellSvg = ({
	size,
	variant,
	children,
	bevelWidth = 4,
	...props
}: IBaseCellSvgProps) => {
	const colors = useFieldColors()

	const renderBackground = () => {
		const innerDim = 30 - bevelWidth
		switch (variant) {
			case 'closed':
			case 'missed':
				const bg = variant == 'closed' ? colors.CLOSED : colors.MISSED
				return (
					<>
						{/* Основной фон */}
						<rect width="30" height="30" fill={bg} />
						{/* Светлая фаска (сверху и слева) */}
						<polygon
							points={`0,0 30,0 ${innerDim},${bevelWidth} ${bevelWidth},${bevelWidth} ${bevelWidth},${innerDim} 0,30`}
							fill={colors.LIGHT_BEVEL}
							fillOpacity="0.8"
						/>
						{/* Темная фаска (снизу и справа) */}
						<polygon
							points={`30,0 30,30 0,30 ${bevelWidth},${innerDim} ${innerDim},${innerDim} ${innerDim},${bevelWidth}`}
							fill={colors.DARK_BEVEL}
							fillOpacity="0.6"
						/>
					</>
				)
			case 'exploded':
				return (
					<>
						<rect width="30" height="30" fill={colors.EXPLODED} />
						<rect
							x="1"
							y="1"
							width="28"
							height="28"
							fill="none"
							stroke={colors.EXPLODED_BORDER}
							strokeWidth="2"
						/>
					</>
				)
			case 'open':
			default:
				return (
					<>
						<rect width="30" height="30" fill={colors.REVEALED} />
						<rect
							x="0"
							y="0"
							width="30"
							height="30"
							fill="none"
							stroke={colors.BORDER}
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
