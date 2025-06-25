import { useMemo } from 'react'
import { CellData } from '@/engine'
import { Layer, RectShape, Group } from '@/ui-engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { DigitShape } from '@/shared/shapes/digit-shape'
import { MineShape } from '@/shared/shapes/mine-shape'
import { CrossShape } from '@/shared/shapes/cross-shape'
import { FlagShape } from '@/shared/shapes/flag-shape'
import { useIncrementalRender } from '@/shared/lib/use-incremental-render'
import { BevelShape } from './shapes/bevel-shape'

interface FieldProps {
	gameOver: boolean
	width: number
	height: number
	data: CellData[][]
	zIndex: number
}

export const SquareStaticField = ({
	width,
	height,
	data,
	gameOver,
	zIndex,
}: FieldProps) => {
	const {
		cell: { size, font },
	} = useViewConfig()
	const { REVEALED, CLOSED, MINE, FLAG, FLAG_SHAFT, EXPLODED, ...digits } =
		useGameColors()

	const layersContent = useMemo(() => {
		return data.flat().reduce(
			(acc, cellData) => {
				const cellKey = cellData.key
				const x = cellData.position.col * size
				const y = cellData.position.row * size

				// Слой Solution - рисуем полное отображение открытого поля включая (все цифры и мины)
				if (cellData.adjacentMines > 0 && !cellData.isMine) {
					const colorKey =
						cellData.adjacentMines as unknown as keyof typeof digits

					acc.solutionDigitsAndMines.push(
						<DigitShape
							key={`${cellKey}-digit`}
							digit={cellData.adjacentMines}
							font={font}
							color={digits[colorKey]}
							size={size}
							x={x}
							y={y}
						/>
					)
				} else if (cellData.isMine) {
					acc.solutionDigitsAndMines.push(
						<MineShape
							key={`${cellKey}-mine`}
							x={x}
							y={y}
							color={MINE}
							size={size}
						/>
					)
				}

				// Слой "mask" - только фаски для нераскрытых клеток
				if (
					!(cellData.notFoundMine && gameOver) &&
					(cellData.isUntouched || cellData.isFlagged || cellData.isMissed)
				) {
					acc.maskBevels.push(
						<BevelShape key={`${cellKey}-bevel`} x={x} y={y} />
					)
				}

				// 3. Слой "overlay"
				if (cellData.isMissed && gameOver) {
					acc.overlayElements.push(
						<CrossShape
							x={x}
							y={y}
							key={`${cellKey}-missed`}
							size={size}
						/>
					)
				} else if (cellData.isFlagged) {
					acc.overlayElements.push(
						<Group x={x} y={y} key={`${cellKey}-flag`}>
							{/* Для надежного bounding box флага рисуем прозрачный квадрат */}
							<RectShape width={size} height={size} />
							<FlagShape
								size={size}
								flagColor={FLAG}
								shaftColor={FLAG_SHAFT}
							/>
						</Group>
					)
				} else if (cellData.isExploded) {
					acc.overlayElements.push(
						<Group x={x} y={y} key={`${cellKey}-exploded`}>
							<RectShape
								height={size}
								width={size}
								fillColor={EXPLODED}
							/>
							<MineShape color={MINE} size={size} />
						</Group>
					)
				}

				return acc
			},
			{
				solutionDigitsAndMines: [] as JSX.Element[],
				maskBevels: [] as JSX.Element[],
				overlayElements: [] as JSX.Element[],
			}
		)
	}, [data, size, gameOver])

	const solutionBackground = useMemo(
		() => (
			<RectShape
				x={0}
				y={0}
				width={width}
				height={height}
				fillColor={REVEALED}
				zIndex={-1}
			/>
		),
		[width, height, REVEALED]
	)

	const maskBackground = useMemo(
		() => (
			<RectShape
				x={0}
				y={0}
				width={width}
				height={height}
				fillColor={CLOSED}
				zIndex={-1}
			/>
		),
		[width, height, CLOSED]
	)

	const { renderer: maskRenderer } = useIncrementalRender()

	const { renderer: overlayRenderer } = useIncrementalRender()

	if (data.length === 0) return null

	return (
		<>
			{/* Слой 1: Фон открытых клеток + Цифры и Мины */}
			<Layer name="solution" zIndex={zIndex}>
				{solutionBackground}
				{layersContent.solutionDigitsAndMines}
			</Layer>

			{/* Слой 2: Фон закрытых клеток + Фаски */}
			<Layer name="mask" zIndex={zIndex + 1} renderer={maskRenderer} opacity={0.5}>
				{maskBackground}
				{layersContent.maskBevels}
			</Layer>

			{/* Слой 4: Флажки, взорвавшиеся мины, промахи */}
			<Layer name="overlay" zIndex={zIndex + 2} renderer={overlayRenderer}>
				{layersContent.overlayElements}
			</Layer>
		</>
	)
}
