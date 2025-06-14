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
	const { params, type } = config

	const { time, resetTimer, startTimer, stopTimer } = useTimer()
	const { score, efficiency, updateStatistic, resetStatistic } = useStatistic()

	const {
		drawingData,
		gameOver,
		revealed,
		status,
		remainingMines,
		revealCell,
		toggleFlag,
		resetGame,
	} = useGame(config)

	const lastStatus = useRef(status)

	const reset = () => {
		resetTimer()
		resetStatistic()
		resetGame()
	}

	const onPlay = () => {
		startTimer()
	}

	const onLose = () => {
		stopTimer()
	}

	const onWin = () => {
		stopTimer()
	}

	const onClick = (pos: Position) => {
		if (gameOver) return

		const result = revealCell(pos)
		updateStatistic({ revealed: result.revealed, time, params })

		if (result.status !== lastStatus.current) {
			if (result.status === GameStatus.Playing) onPlay()
			else if (result.status === GameStatus.Won) onWin()
			else if (result.status === GameStatus.Lost) onLose()
			lastStatus.current = result.status
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
