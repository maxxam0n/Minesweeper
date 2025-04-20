import { PropsWithChildren, useMemo } from 'react'
import { BaseCellSvg, IBaseCellSvgProps } from './BaseCellSvg'
import { FlagIcon } from './FlagIcon'
import { MineIcon } from './MineIcon'
import { NumberIcon } from './NumberIcon'
import { CellModel } from '../model/CellModel'

interface ICellProps extends PropsWithChildren {
	cellModel: CellModel
	size: number
	isGameOver?: boolean
}

export const Cell = ({
	cellModel: { isRevealed, isFlagged, isMined, minesAround, position },
	size,
	isGameOver = false,
}: ICellProps) => {
	const contend = useMemo(() => {
		// 1. Флаг (если поставлен и ячейка не открыта)
		if (isFlagged && !isRevealed) {
			// Если игра окончена и под флагом не было мины - показать перечеркнутый флаг или спец. иконку?
			// Пока просто показываем флаг
			return <FlagIcon />
		}

		// 2. Если ячейка открыта
		if (isRevealed) {
			if (isMined) {
				// Мина! Показываем ее. isExplodedMine определяет фон через variant.
				return <MineIcon />
			}
			if (minesAround > 0) {
				return <NumberIcon value={minesAround} />
			}
			// Если minesAround === 0, контент не нужен (пустая открытая ячейка)
			return null
		}

		// 3. Если игра окончена и ячейка не была открыта, но там мина (и не флаг)
		if (isGameOver && isMined && !isFlagged) {
			return <MineIcon />
		}

		// 4. Закрытая ячейка без флага
		return null
	}, [isFlagged, isMined, isRevealed, minesAround, isGameOver])

	// Определяем стиль фона
	const getVariant = (): IBaseCellSvgProps['variant'] => {
		if (isGameOver) {
			if (isFlagged && !isMined) return 'missed'
			if (isFlagged && isMined) return 'closed'
			if (isMined && isRevealed) return 'exploded'
			if (isMined || isRevealed) return 'open'
			return 'closed'
		} else {
			if (isFlagged) return 'closed'
			if (isRevealed) return 'open'
			return 'closed'
		}
	}

	return (
		<button
			data-x={position.x}
			data-y={position.y}
			className="cell cursor-pointer"
			style={{ maxWidth: size + 'px', maxHeight: size + 'px' }}
		>
			<BaseCellSvg size={size} variant={getVariant()}>
				{contend}
			</BaseCellSvg>
		</button>
	)
}
