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
		if (gameOver) return null

		const { data, apply } = gameInstance.current.revealCell(pos)
		const applyAction = () => {
			setGameState(data.actionSnapshot)
			apply()
		}

		return {
			data,
			applyAction,
		}
	}

	const toggleFlag = (pos: Position) => {
		if (gameOver) return gameState

		gameInstance.current.toggleFlag(pos)
		setGameState(gameInstance.current.gameSnapshot)

		return gameInstance.current.gameSnapshot
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
