import { Fragment, useMemo } from 'react'
import { CellData } from '@/engine'
import { useViewConfig } from '@/providers/game-view-provider'
import { useGameColors } from '@/providers/game-colors-provider'
import { Layer, RectShape } from '@/ui-engine'
import {
	BaseCellShape,
	BevelShape,
	DigitShape,
	FlagShape,
	MineShape,
	MissedShape,
} from '@/entities/cell-shape'
import { useIncrementalRender } from '../lib/use-incremental-render'

interface IFieldProps {
	gameOver: boolean
	width: number
	height: number
	data: CellData[][]
	zIndex: number
}

export const GameField = ({
	width,
	height,
	data,
	gameOver,
	zIndex,
}: IFieldProps) => {
	const { REVEALED, CLOSED } = useGameColors()
	const { cellSize } = useViewConfig()

	const layersContent = useMemo(() => {
		return data.flat().reduce(
			(acc, cellData) => {
				const cellKey = cellData.key
				const x = cellData.position.col * cellSize
				const y = cellData.position.row * cellSize

				// Слой Solution - рисуем полное отображение открытого поля включая (все цифры и мины)
				if (cellData.adjacentMines > 0 && !cellData.isMine) {
					acc.solutionDigitsAndMines.push(
						<DigitShape
							key={`${cellKey}-digit`}
							digit={cellData.adjacentMines}
							x={x}
							y={y}
						/>
					)
				} else if (cellData.isMine) {
					acc.solutionDigitsAndMines.push(
						<MineShape key={`${cellKey}-mine`} x={x} y={y} />
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
						<MissedShape x={x} y={y} key={`${cellKey}-missed`} />
					)
				} else if (cellData.isFlagged) {
					acc.overlayElements.push(
						<Fragment key={`${cellKey}-flag`}>
							{/* RectShape надежный boundingBox для maskRenderer */}
							<RectShape
								width={cellSize}
								height={cellSize}
								x={x}
								y={y}
							/>
							<FlagShape x={x} y={y} />
						</Fragment>
					)
				} else if (cellData.isExploded) {
					acc.overlayElements.push(
						<BaseCellShape
							key={`${cellKey}-exploded`}
							x={x}
							y={y}
							exploded={true}
						>
							<MineShape x={x} y={y} />
						</BaseCellShape>
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
	}, [data, cellSize, gameOver])

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
			<Layer name="mask" zIndex={zIndex + 1} renderer={maskRenderer}>
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
