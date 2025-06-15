import { useGameColors } from '@/providers/game-colors-provider'
import { CircleShape, LineShape } from '@/shared/canvas'

interface MineShapeProps {
	x: number
	y: number
	size: number
}

export const MineShape = ({ x, y, size }: MineShapeProps) => {
	const { MINE } = useGameColors()

	// --- Параметры для настройки внешнего вида ---
	const center = {
		x: x + size / 2,
		y: y + size / 2,
	}

	const mainRadius = size * 0.25 // Радиус основного черного шара
	const spikeLength = size * 0.4 // Длина шипов от центра
	const spikeWidth = size * 0.05 // Толщина шипов
	const glareRadius = size * 0.05 // Радиус блика
	const glareOffset = size * 0.1 // Смещение блика от центра

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
}
