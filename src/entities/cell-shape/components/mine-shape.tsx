import { memo } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { CircleShape, LineShape } from '@/shared/canvas'

interface MineShapeProps {
	x: number
	y: number
}

export const MineShape = memo(({ x, y }: MineShapeProps) => {
	const { MINE } = useGameColors()
	const { cellSize } = useViewConfig()

	// --- Параметры для настройки внешнего вида ---
	const center = {
		x: x + cellSize / 2,
		y: y + cellSize / 2,
	}

	const mainRadius = cellSize * 0.25 // Радиус основного черного шара
	const spikeLength = cellSize * 0.4 // Длина шипов от центра
	const spikeWidth = cellSize * 0.05 // Толщина шипов
	const glareRadius = cellSize * 0.05 // Радиус блика
	const glareOffset = cellSize * 0.1 // Смещение блика от центра

	// --- Основной шар мины ---
	const MainBody = (
		<CircleShape
			cx={center.x}
			cy={center.y}
			radius={mainRadius}
			fillColor={MINE}
			zIndex={2}
		/>
	)

	// --- Блик ---
	const Glare = (
		<CircleShape
			cx={center.x - glareOffset}
			cy={center.y - glareOffset}
			radius={glareRadius}
			fillColor={'#FFFFFF'}
			zIndex={3}
		/>
	)

	const spikeEndPoints = [
		// Горизонтальные и вертикальные
		{ x: center.x + spikeLength, y: center.y },
		{ x: center.x - spikeLength, y: center.y },
		{ x: center.x, y: center.y + spikeLength },
		{ x: center.x, y: center.y - spikeLength },
		// Диагональные (длина по диагонали ~ spikeLength * 0.58)
		{ x: center.x + spikeLength * 0.58, y: center.y + spikeLength * 0.58 },
		{ x: center.x - spikeLength * 0.58, y: center.y - spikeLength * 0.58 },
		{ x: center.x + spikeLength * 0.58, y: center.y - spikeLength * 0.58 },
		{ x: center.x - spikeLength * 0.58, y: center.y + spikeLength * 0.58 },
	]

	const Spikes = (
		<>
			{spikeEndPoints.map((endPoint, index) => (
				<LineShape
					key={index}
					x1={center.x}
					y1={center.y}
					x2={endPoint.x}
					y2={endPoint.y}
					strokeColor={MINE}
					lineWidth={spikeWidth}
					zIndex={1}
				/>
			))}
		</>
	)

	return (
		<>
			{Spikes}
			{MainBody}
			{Glare}
		</>
	)
})
