import { memo } from 'react'
import { CellDrawingData, CellDrawingView } from '@/engine'
import { useGameColors } from '@/providers/game-colors-provider'
import {
	CircleShape,
	LineShape,
	PolygonShape,
	RectShape,
	TextShape,
} from '@/shared/canvas'

interface CellProps {
	data: CellDrawingData
	size: number
}

const areCellsEqual = (
	prevProps: Readonly<CellProps>,
	nextProps: Readonly<CellProps>
): boolean => {
	return prevProps.data.view === nextProps.data.view
}

const CellShapeComponent = ({ data, size }: CellProps) => {
	// Получаем всю палитру цветов
	const {
		LIGHT_BEVEL,
		DARK_BEVEL,
		CLOSED,
		BORDER,
		EXPLODED,
		EXPLODED_BORDER,
		FLAG,
		FLAG_SHAFT,
		MINE,
		MISSED,
		REVEALED,
		...digits
	} = useGameColors()
	const { position, view, adjacentMines } = data

	// Рассчитываем позицию ячейки на холсте
	const x = position.x * size
	const y = position.y * size

	// Функция для отрисовки "утопленной" 3D-рамки
	const renderBevel = () => (
		<>
			{/* Светлая грань сверху и слева */}
			<PolygonShape
				points={[
					{ x, y },
					{ x: x + size, y },
					{ x: x + size - 2, y: y + 2 },
					{ x: x + 2, y: y + 2 },
					{ x: x + 2, y: y + size - 2 },
					{ x, y: y + size },
				]}
				closed={true}
				fillColor={LIGHT_BEVEL}
				zIndex={1}
			/>
			{/* Темная грань снизу и справа */}
			<PolygonShape
				points={[
					{ x: x + size, y: y + size },
					{ x, y: y + size },
					{ x: x + 2, y: y + size - 2 },
					{ x: x + size - 2, y: y + size - 2 },
					{ x: x + size - 2, y: y + 2 },
					{ x: x + size, y },
				]}
				fillColor={DARK_BEVEL}
				closed={true}
				zIndex={1}
			/>
		</>
	)

	switch (view) {
		case CellDrawingView.Closed:
			return (
				<>
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={CLOSED}
					/>
					{renderBevel()}
				</>
			)

		case CellDrawingView.Empty:
			return (
				<RectShape
					x={x}
					y={y}
					width={size}
					height={size}
					fillColor={REVEALED}
					strokeColor={BORDER}
					lineWidth={1}
				/>
			)

		case CellDrawingView.Digit:
			return (
				<>
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={REVEALED}
						strokeColor={BORDER}
						lineWidth={1}
					/>
					<TextShape
						text={String(adjacentMines)}
						x={x + size / 2}
						y={y + size / 2}
						font={`${size * 0.6}px "Digital", monospace`}
						textAlign="center"
						textBaseline="middle"
						fillColor={
							digits[String(adjacentMines) as keyof typeof digits]
						}
						zIndex={2}
					/>
				</>
			)

		case CellDrawingView.Flag:
			return (
				<>
					{/* Фон как у закрытой ячейки */}
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={CLOSED}
					/>
					{renderBevel()}
					{/* Древко флага */}
					<LineShape
						x1={x + size / 2}
						y1={y + size * 0.2}
						x2={x + size / 2}
						y2={y + size * 0.8}
						strokeColor={FLAG_SHAFT}
						lineWidth={2}
						zIndex={3}
					/>
					{/* Сам флаг */}
					<PolygonShape
						points={[
							{ x: x + size / 2, y: y + size * 0.2 },
							{ x: x + size / 2, y: y + size * 0.5 },
							{ x: x + size * 0.2, y: y + size * 0.35 },
						]}
						closed={true}
						fillColor={FLAG}
						zIndex={4}
					/>
				</>
			)

		case CellDrawingView.Mine:
			return (
				<>
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={REVEALED}
						strokeColor={BORDER}
						lineWidth={1}
					/>
					<CircleShape
						cx={x + size / 2}
						cy={y + size / 2}
						radius={size * 0.3}
						fillColor={MINE}
						zIndex={2}
					/>
				</>
			)

		case CellDrawingView.Exploded:
			return (
				<>
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={EXPLODED}
						strokeColor={EXPLODED_BORDER}
						lineWidth={1}
					/>
					<CircleShape
						cx={x + size / 2}
						cy={y + size / 2}
						radius={size * 0.3}
						fillColor={MINE}
						zIndex={2}
					/>
				</>
			)

		case CellDrawingView.Missed:
			return (
				<>
					<RectShape
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={MISSED}
					/>
					{/* Красный крестик */}
					<LineShape
						x1={x + size * 0.2}
						y1={y + size * 0.2}
						x2={x + size * 0.8}
						y2={y + size * 0.8}
						strokeColor="red"
						lineWidth={3}
						zIndex={2}
					/>
					<LineShape
						x1={x + size * 0.8}
						y1={y + size * 0.2}
						x2={x + size * 0.2}
						y2={y + size * 0.8}
						strokeColor="red"
						lineWidth={3}
						zIndex={2}
					/>
				</>
			)

		default:
			return null
	}
}

export const CellShape = memo(CellShapeComponent, areCellsEqual)
