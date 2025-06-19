import { useRef, useState } from 'react'
import { GameEngine, GameSnapshot, GameStatus, Position } from '@/engine'
import { GameConfig } from '../lib/types'

export const useGame = ({ params, type, seed, mode }: GameConfig) => {
	const gameInstance = useRef(new GameEngine({ params, type, seed, mode }))
	const [gameState, setGameState] = useState<GameSnapshot>(
		gameInstance.current.gameSnapshot
	)

	const { drawingData, flagged, revealed, status } = gameState
	const gameOver = status == GameStatus.Won || status == GameStatus.Lost
	const remainingMines = params.mines - flagged

	const resetGame = () => {
		gameInstance.current = new GameEngine({
			params,
			type,
			mode,
			seed: String(Date.now()),
		})
		setGameState(gameInstance.current.gameSnapshot)
	}

	const revealCell = (pos: Position) => {
		if (gameOver) return { gameState, animationEvents: [] }

		const { gameSnapshot: actualState, animationEvents } =
			gameInstance.current.revealCell(pos)
		setGameState(actualState)

		return { gameState: actualState, animationEvents }
	}

	const toggleFlag = (pos: Position) => {
		if (gameOver) return gameState

		const { gameSnapshot: actualState } = gameInstance.current.toggleFlag(pos)
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
