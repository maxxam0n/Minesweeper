import { useState } from 'react'
import {
	Field,
	FieldFactory,
	FieldParams,
	Position,
} from '@/modules/game-field'

export type GameStatus = 'lose' | 'win' | 'play' | 'idle'

export type UseGameProps = {
	config: FieldParams
	onPlay?: () => void
	onWin?: () => void
	onLose?: () => void
	onReset?: () => void
}

const createField = (config: FieldParams) => FieldFactory.create(config)

export const useGame = ({
	config,
	onLose = () => {},
	onPlay = () => {},
	onWin = () => {},
	onReset = () => {},
}: UseGameProps) => {
	const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
	const [fieldModel, setFieldModel] = useState(() => createField(config))
	const [flagsCount, setFlagsCount] = useState(0)
	const [cellsOpened, setCellsOpened] = useState(0)

	const isGameOver = gameStatus === 'win' || gameStatus === 'lose'

	const callGameLifeCycle = (status: GameStatus) => {
		setGameStatus(status)
		if (status === 'lose') onLose()
		if (status === 'win') onWin()
		if (status === 'play') onPlay()
		if (status === 'idle') onReset()
	}

	const resetGame = () => {
		setFieldModel(createField(config))
		setFlagsCount(0)
		setCellsOpened(0)
		callGameLifeCycle('idle')
	}

	/**
	 *    ----------- Обработчик открытия клетки -----------
	 * 1. Если клетка заминирована, открывает ее и вызывает onLose
	 * 2. Если клетка не пустая, открывает ее
	 * 3. Если клетка пустая, открывает ее и все пустые соседние клетки через BFS (getAreaToReveal)
	 * 4. Если клетка открыта, проверяет наличие флажков вокруг и открывает соседние клетки
	 * 5. Увеличивает счетчик открытых клеток
	 * 6. Если клетка найдена через BFS и она отмечена флажком, снимает флажок
	 * 7. Если все клетки открыты, вызывает onWin
	 * 8. При первом клике устанавливает мины и вызывает onPlay
	 * @param pos
	 * @returns
	 */
	const openCellHandler = (pos: Position) => {
		if (isGameOver || fieldModel.getCell(pos).isFlagged) return

		let status: GameStatus = gameStatus
		let actual: Field = fieldModel
		let opened: number = cellsOpened
		let flagged: number = flagsCount

		const searchAndOpen = (pos: Position) => {
			const area = actual.getAreaToReveal(pos)
			area.forEach(areaPos => {
				if (actual.getCell(areaPos).isFlagged) {
					actual = actual.markCellImmutable(areaPos, false)
					flagged -= 1
				}
				if (actual.getCell(areaPos).isRevealed) return
				actual = actual.openCellImmutable(areaPos)
				opened += 1
			})
		}

		if (!fieldModel.isMinesPlaced || status === 'idle') {
			status = 'play'
			actual = fieldModel.placeMines(pos)
		}

		const targetCell = actual.getCell(pos)

		if (targetCell.isMined) {
			status = 'lose'
			actual = actual.openCellImmutable(pos)
		} else if (targetCell.isRevealed) {
			const siblings = fieldModel.getSiblings(pos)
			const flagsAroundCount = siblings.reduce((sum, pos) => {
				return sum + Number(actual.getCell(pos).isFlagged)
			}, 0)
			if (flagsAroundCount === targetCell.minesAround) {
				siblings.forEach(sibPos => {
					const cell = actual.getCell(sibPos)
					if (cell.isFlagged || cell.isRevealed) return
					if (cell.isMined && !cell.isFlagged) {
						status = 'lose'
						actual = actual.openCellImmutable(sibPos)
					} else if (cell.isEmpty) {
						searchAndOpen(sibPos)
					} else {
						actual = actual.openCellImmutable(sibPos)
						opened += 1
					}
				})
			}
		} else {
			searchAndOpen(pos)
		}

		status = opened === fieldModel.needToOpen ? 'win' : status

		if (status !== gameStatus) {
			callGameLifeCycle(status)
		}

		setFlagsCount(flagged)
		setCellsOpened(opened)
		setFieldModel(actual)
	}

	/**
	 * 1. Если клетка не открыта, отмечает ее или снимает флажок
	 * 2. Нельзя установить больше флажков, чем количество мин на поле
	 * @param pos
	 * @returns
	 */
	const markCellHandler = (pos: Position) => {
		const cell = fieldModel.getCell(pos)
		if (gameStatus !== 'play' || cell.isRevealed) return

		const willBeFlagged = !cell.isFlagged
		if (flagsCount === fieldModel.params.mines && willBeFlagged) return

		setFlagsCount(count => (willBeFlagged ? count + 1 : count - 1))
		setFieldModel(fieldModel.markCellImmutable(pos, willBeFlagged))
	}

	return {
		field: fieldModel.field,
		flagsCount,
		cellsOpened,
		gameStatus,
		openCellHandler,
		markCellHandler,
		resetGame,
	}
}
