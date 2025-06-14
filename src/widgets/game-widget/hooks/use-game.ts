import { useRef, useState } from 'react'
import { GameEngine, GameState, GameStatus, Position } from '@/engine'
import { GameConfig } from '../lib/types'

export const useGame = ({ params, type, seed, noGuessing }: GameConfig) => {
	const gameInstance = useRef(
		new GameEngine({ params, type, seed, noGuessing })
	)
	const [gameState, setGameState] = useState<GameState>(
		gameInstance.current.gameState
	)

	const { drawingData, flagged, revealed, status } = gameState
	const gameOver = status == GameStatus.Won || status == GameStatus.Lost
	const remainingMines = params.mines - flagged

	const resetGame = () => {
		gameInstance.current = new GameEngine({ params, type, seed })
		setGameState(gameInstance.current.gameState)
	}

	const revealCell = (pos: Position) => {
		if (gameOver) return gameState

		const { gameState: actualState } = gameInstance.current.revealCell(pos)
		setGameState(actualState)

		return actualState
	}

	const toggleFlag = (pos: Position) => {
		if (gameOver) return gameState

		const { gameState: actualState } = gameInstance.current.toggleFlag(pos)
		setGameState(actualState)

		return actualState
	}

	return {
		drawingData,
		flagged,
		revealed,
		status,
		gameOver,
		remainingMines,
		resetGame,
		revealCell,
		toggleFlag,
	}
}
