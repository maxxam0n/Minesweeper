import { useContext } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { CircleShape, LineShape, PolygonShape } from '@/shared/canvas'
import { LayerContext } from '../model/layer-context'

interface FlagShapeProps {
	x: number
	y: number
	size: number
}

export const FlagShape = ({ x, y, size }: FlagShapeProps) => {
	const layer = useContext(LayerContext)

	const { FLAG_SHAFT, FLAG } = useGameColors()

	// --- Параметры для настройки ---
	// Древко
	const shaftX = x + size * 0.4 // Смещаем влево, чтобы флаг был главным
	const shaftTopY = y + size * 0.25
	const shaftBottomY = y + size * 0.79
	const shaftWidth = size * 0.08

	// Навершие (шарик)
	const finialRadius = shaftWidth * 0.6

	// Основание
	const baseWidth = size * 0.4
	const baseHeight = shaftWidth * 1.2

	// Полотнище
	const flagTopY = shaftTopY + finialRadius
	const flagHeight = size * 0.25
	const flagWidth = size * 0.35
	const cutoutDepth = flagWidth * 0.3 // Глубина V-образного выреза

	// Круглая метка на флаге
	const decorationCenterY = flagTopY + flagHeight / 2

	// --- Сборка флага ---

	return (
		<>
			{/* 1. Древко */}
			<LineShape
				layer={layer}
				x1={shaftX}
				y1={shaftTopY}
				x2={shaftX}
				y2={shaftBottomY}
				strokeColor={FLAG_SHAFT}
				lineWidth={shaftWidth}
				zIndex={2}
			/>

			{/* 2. Навершие */}
			<CircleShape
				layer={layer}
				cx={shaftX}
				cy={shaftTopY}
				radius={finialRadius}
				fillColor={FLAG_SHAFT}
				zIndex={3}
			/>

			{/* 3. Основание */}
			<LineShape
				layer={layer}
				x1={shaftX - baseWidth / 3}
				y1={shaftBottomY}
				x2={shaftX + baseWidth / 1.8}
				y2={shaftBottomY}
				strokeColor={FLAG_SHAFT}
				lineWidth={baseHeight}
				zIndex={1} // Под древком для эффекта объема
			/>

			{/* 4. Полотнище "ласточкин хвост" */}
			<PolygonShape
				layer={layer}
				points={[
					{ x: shaftX, y: flagTopY }, // Верхняя точка у древка
					{ x: shaftX + flagWidth, y: flagTopY }, // Верхняя правая точка
					{ x: shaftX + flagWidth - cutoutDepth, y: decorationCenterY }, // Внутренняя точка выреза
					{ x: shaftX + flagWidth, y: flagTopY + flagHeight }, // Нижняя правая точка
					{ x: shaftX, y: flagTopY + flagHeight }, // Нижняя точка у древка
				]}
				closed={true}
				fillColor={FLAG}
				zIndex={4}
			/>
		</>
	)
}
