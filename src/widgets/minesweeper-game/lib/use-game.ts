import { useRef, useState } from 'react'
import { GameEngine, GameSnapshot, GameStatus, Position } from '@/engine'
import { GameConfig } from './types'

export const useGame = ({ params, type, seed, mode }: GameConfig) => {
	const gameInstance = useRef(new GameEngine({ params, type, seed, mode }))

	const [gameState, setGameState] = useState<GameSnapshot>(
		gameInstance.current.gameSnapshot
	)

	const { field, flagged, revealed, status } = gameState

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
		const { data, apply } = gameInstance.current.revealCell(pos)

		return {
			data,
			apply() {
				setGameState(data.actionSnapshot)
				apply()
			},
		}
	}

	const toggleFlag = (pos: Position) => {
		const { data, apply } = gameInstance.current.toggleFlag(pos)

		return {
			data,
			apply() {
				setGameState(data.actionSnapshot)
				apply()
			},
		}
	}

	return {
		field,
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
