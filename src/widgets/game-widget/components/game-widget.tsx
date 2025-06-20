import { useCallback, useRef, useState } from 'react'
import { ActionChanges, GameSnapshot, GameStatus, Position } from '@/engine'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { GameConfig } from '../lib/types'
import { GameField } from './game-field'
import { AnimationField } from './animation-field'

interface IGameProps {
	gameConfig: GameConfig
}

interface ActiveAnimation {
	id: string
	type: 'cellReveal'
	col: number
	row: number
}

let nextAnimationId = 0

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

	const [activeAnimations, setActiveAnimations] = useState<ActiveAnimation[]>(
		[]
	)

	const [pressedPositions, setPressedPositions] = useState<Position[]>([])

	const lastActionRef = useRef<{
		applyAction: () => void
		actionChanges: ActionChanges
		actionSnapshot: GameSnapshot
	} | null>(null)

	const handleCellPress = (pos: Position) => {
		const result = revealCell(pos)
		if (result) {
			const {
				data: { actionSnapshot, actionChanges },
				applyAction,
			} = result

			if (actionChanges.previewPressPositions.length > 0) {
				const newAnimations: ActiveAnimation[] = []

				actionChanges.previewPressPositions.forEach(pos => {
					newAnimations.push({
						id: `reveal-${nextAnimationId++}`,
						type: 'cellReveal',
						col: pos.col,
						row: pos.row,
					})
				})

				setActiveAnimations(prev => [...prev, ...newAnimations])
			}

			setPressedPositions(actionChanges.previewPressPositions)
			lastActionRef.current = {
				applyAction,
				actionChanges,
				actionSnapshot,
			}
		}
	}

	const onClick = () => {
		if (gameOver) return
		if (lastActionRef.current) {
			const { applyAction, actionChanges, actionSnapshot } =
				lastActionRef.current

			applyAction()

			updateStatistic({ revealed: actionSnapshot.revealed, time, params })
			if (actionSnapshot.status !== lastStatus.current) {
				if (actionSnapshot.status === GameStatus.Playing) onPlay()
				else if (actionSnapshot.status === GameStatus.Won) onWin()
				else if (actionSnapshot.status === GameStatus.Lost) onLose()
				lastStatus.current = actionSnapshot.status
			}

			const { revealedPositions } = actionChanges

			if (
				revealedPositions &&
				revealedPositions.length > 0 &&
				revealedPositions.length < 500
			) {
				const newAnimations: ActiveAnimation[] = []

				revealedPositions.forEach(pos => {
					newAnimations.push({
						id: `reveal-${nextAnimationId++}`,
						type: 'cellReveal',
						col: pos.col,
						row: pos.row,
					})
				})
				setActiveAnimations(prev => [...prev, ...newAnimations])
			}

			lastActionRef.current = null
		}
	}

	const handleAnimationComplete = useCallback((animationId: string) => {
		setActiveAnimations(prev => prev.filter(anim => anim.id !== animationId))
	}, [])

	const handleCellRelease = (isClick: boolean) => {
		setPressedPositions([])
		if (isClick) onClick()
		else lastActionRef.current = null
	}

	return (
		<GameField
			drawingData={drawingData}
			gameStatus={status}
			onToggleFlag={toggleFlag}
			onCellPress={handleCellPress}
			onCellRelease={handleCellRelease}
		>
			<AnimationField
				pressedPositions={pressedPositions}
				activeCellRevealEffects={activeAnimations.filter(
					a => a.type === 'cellReveal'
				)}
				onAnimationComplete={handleAnimationComplete}
			/>
		</GameField>
	)
}
