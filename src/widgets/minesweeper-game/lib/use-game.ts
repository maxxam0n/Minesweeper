import { useRef, useState } from 'react'
import {
	GameEngine,
	GameSnapshot,
	GameStatus,
	MineSweeperConfig,
	Position,
} from '@/engine'

export const useGame = ({
	params,
	type,
	mode,
	...other
}: MineSweeperConfig) => {
	const gameInstance = useRef(new GameEngine({ params, type, ...other }))

	const [gameState, setGameState] = useState<GameSnapshot>(
		gameInstance.current.gameSnapshot
	)

	const { status, flaggedCells, ...otherData } = gameState

	const gameOver = status == GameStatus.Won || status == GameStatus.Lost
	const remainingMines = params.mines - flaggedCells.length

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
		status,
		gameOver,
		flaggedCells,
		remainingMines,
		...otherData,
		resetGame,
		revealCell,
		toggleFlag,
	}
}
