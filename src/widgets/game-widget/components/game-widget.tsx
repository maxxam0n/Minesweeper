import { useRef } from 'react'
import { GameStatus, Position } from '@/engine'
import { useGame } from '../hooks/use-game'
import { useTimer } from '../hooks/use-timer'
import { useStatistic } from '../hooks/use-statistic'
import { GameConfig } from '../lib/types'
import { GameField } from './game-field'

interface IGameProps {
	config: GameConfig
}

export const GameWidget = ({ config }: IGameProps) => {
	const { params } = config

	const { time, startTimer, stopTimer } = useTimer()
	const { updateStatistic } = useStatistic()

	const { drawingData, gameOver, status, revealCell, toggleFlag } =
		useGame(config)

	const lastStatus = useRef(status)

	// const reset = () => {
	// 	resetTimer()
	// 	resetStatistic()
	// 	resetGame()
	// }

	const onPlay = () => {
		startTimer()
	}

	const onLose = () => {
		console.log('lose')
		stopTimer()
	}

	const onWin = () => {
		stopTimer()
	}

	const onClick = (pos: Position) => {
		if (gameOver) return

		const { gameState } = revealCell(pos)

		updateStatistic({ revealed: gameState.revealed, time, params })

		if (gameState.status !== lastStatus.current) {
			if (gameState.status === GameStatus.Playing) onPlay()
			else if (gameState.status === GameStatus.Won) onWin()
			else if (gameState.status === GameStatus.Lost) onLose()
			lastStatus.current = gameState.status
		}
	}

	return (
		<GameField
			drawingData={drawingData}
			isGameOver={gameOver}
			onReveal={onClick}
			onToggleFlag={toggleFlag}
		/>
	)
}
