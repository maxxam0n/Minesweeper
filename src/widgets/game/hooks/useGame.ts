import { useEffect, useState } from 'react'
import { BoardModel, TBoardParams } from '@/features/board'
import { TPosition } from '@/features/board'

export const useGame = (
	boardParams: TBoardParams,
	onWin: () => void,
	onLose: () => void
) => {
	const [gameStatus, setGameStatus] = useState<'lose' | 'win' | 'play'>()
	const [boardModel, setBoardModel] = useState(new BoardModel(boardParams))
	const [flagsCount, setFlagsCount] = useState(0)
	const [cellsOpened, setCellsOpened] = useState(0)

	const isGameOver = gameStatus === 'win' || gameStatus === 'lose'

	const updateBoardState = () => {
		const newBoardModel = Object.create(
			BoardModel.prototype,
			Object.getOwnPropertyDescriptors(boardModel)
		)
		setBoardModel(newBoardModel)
	}

	const openCell = (pos: TPosition) => {
		const cell = boardModel.getCell(pos)
		if (cell.isRevealed) return
		cell.isRevealed = true
		setCellsOpened(count => count + 1)
	}

	const placeFlag = (pos: TPosition, draw?: boolean) => {
		const cell = boardModel.getCell(pos)
		cell.isFlagged = draw === undefined ? !cell.isFlagged : draw
		setFlagsCount(count => (cell.isFlagged ? count + 1 : count - 1))
	}

	const searchAndOpen = (pos: TPosition) => {
		const cells = boardModel.getAreaToReveal(pos)
		cells.forEach(cell => {
			if (cell.isFlagged) placeFlag(cell.position, false)
			openCell(cell.position)
		})
	}

	const resetGame = () => {
		setGameStatus(undefined)
		setBoardModel(new BoardModel(boardParams))
		setFlagsCount(0)
		setCellsOpened(0)
	}

	const openCellHandler = (pos: TPosition) => {
		const targetCell = boardModel.getCell(pos)

		if (isGameOver || targetCell.isFlagged) return

		// Ставим мины при первом клике, первый клик всегда по не заминированной клетке
		if (!boardModel.isMinesPlaced) boardModel.placeMines(pos)

		if (targetCell.isMined) {
			targetCell.isRevealed = true
			setGameStatus('lose')
			onLose()
		} else if (targetCell.isRevealed) {
			const siblings = boardModel.getSiblingCells(targetCell.position)
			const flagsArountCount = siblings.reduce((sum, { isFlagged }) => {
				return sum + Number(isFlagged)
			}, 0)

			if (flagsArountCount === targetCell.minesAround) {
				siblings.forEach(cell => {
					if (cell.isFlagged || cell.isRevealed) return
					if (cell.isMined && !cell.isFlagged) setGameStatus('lose')
					if (cell.isEmpty) searchAndOpen(cell.position)
					else openCell(cell.position)
				})
			}
		} else {
			searchAndOpen(pos)
		}

		updateBoardState()
	}

	const markCellHandler = (pos: TPosition) => {
		if (isGameOver) return
		if (flagsCount === boardModel.params.mines) return
		if (boardModel.getCell(pos).isRevealed) return
		placeFlag(pos)
		updateBoardState()
	}

	useEffect(() => {
		if (cellsOpened === boardModel.needToOpen) {
			setGameStatus('win')
			onWin()
		}
	}, [cellsOpened, boardModel.needToOpen])

	return {
		board: boardModel.board,
		flagsCount,
		cellsOpened,
		gameStatus,
		isGameOver,
		openCellHandler,
		markCellHandler,
		resetGame,
	}
}
