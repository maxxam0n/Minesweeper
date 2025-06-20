import { useRef, useState } from 'react'
import { GameStatus, Position, RevealActionResult } from '@/engine'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { GameConfig } from '../lib/types'
import { GameField } from './game-field'
import { AnimationField } from './animation-field'

interface IGameProps {
	gameConfig: GameConfig
}

export const GameWidget = ({ gameConfig }: IGameProps) => {
	const { params } = gameConfig

	const { time, startTimer, stopTimer } = useTimer()
	const { updateStatistic } = useStatistic()

	const { drawingData, gameOver, status, revealCell, toggleFlag } =
		useGame(gameConfig)

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

	const [pressedPositions, setPressedPositions] = useState<Position[]>([])
	const lastActionApplyer = useRef<(() => RevealActionResult['data']) | null>(
		null
	)

	const handleCellPress = (pos: Position) => {
		const result = revealCell(pos)
		if (result) {
			const { data, applyAction } = result
			setPressedPositions(data.actionChanges.previewPressPositions)
			lastActionApplyer.current = () => {
				applyAction()
				return data
			}
		}
	}

	const onClick = () => {
		if (gameOver) return
		if (lastActionApplyer.current) {
			const { actionSnapshot } = lastActionApplyer.current()
			updateStatistic({ revealed: actionSnapshot.revealed, time, params })
			if (actionSnapshot.status !== lastStatus.current) {
				if (actionSnapshot.status === GameStatus.Playing) onPlay()
				else if (actionSnapshot.status === GameStatus.Won) onWin()
				else if (actionSnapshot.status === GameStatus.Lost) onLose()
				lastStatus.current = actionSnapshot.status
			}
			lastActionApplyer.current = null
		}
	}

	const handleCellRelease = (isClick: boolean) => {
		setPressedPositions([])
		if (isClick) onClick()
	}

	return (
		<GameField
			drawingData={drawingData}
			gameStatus={status}
			onToggleFlag={toggleFlag}
			onCellPress={handleCellPress}
			onCellRelease={handleCellRelease}
		>
			<AnimationField pressedPositions={pressedPositions} />
		</GameField>
	)
}
