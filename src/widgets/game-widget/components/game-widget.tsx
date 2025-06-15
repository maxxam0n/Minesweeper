import { useRef, useState } from 'react'
import { GameStatus, Position } from '@/engine'
import { BevelPressAnimation } from '@/entities/cell-shape'
import { Layer } from '@/shared/canvas'
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

	const [animations, setAnimations] = useState<any[]>([])
	const animationIdCounter = useRef(0)

	const addAnimation = (type: string, props: object) => {
		const id = animationIdCounter.current++
		setAnimations(prev => [...prev, { id, type, ...props }])
	}

	const removeAnimation = (id: number) => {
		setAnimations(prev => prev.filter(anim => anim.id !== id))
	}

	const onClick = (pos: Position) => {
		if (gameOver) return

		const { gameState, animationEvents } = revealCell(pos)
		updateStatistic({ revealed: gameState.revealed, time, params })

		animationEvents.forEach(event => {
			if (event.type === 'press') {
				addAnimation('press', { pos: event.pos })
			}
			if (event.type === 'cascade') {
				event.positions.forEach((p, index) => {
					setTimeout(() => {
						addAnimation('press', { pos: p })
					}, index * 15)
				})
			}
		})

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
		>
			<Layer name="animations" zIndex={10}>
				{animations.map(anim => {
					if (anim.type === 'press') {
						return (
							<BevelPressAnimation
								key={anim.id}
								pos={anim.pos}
								cellSize={30} // или из viewConfig
								onComplete={() => removeAnimation(anim.id)}
							/>
						)
					}
					return null
				})}
			</Layer>
		</GameField>
	)
}
