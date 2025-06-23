import { useViewConfig } from '@/providers/game-view'
import { SquareField } from '@/entities/field-square'
import { useAnimations } from '@/shared/lib/use-animations'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { ActionCommittedCallback, GameConfig } from '../lib/types'
import { useGameLifecycle } from '../lib/use-game-lifecycle'
import { useAnimatedInteraction } from '../lib/use-animated-interaction'
import { useDirectInteraction } from '../lib/use-direct-interaction'
import { GameFieldHandlers } from './game-field-handlers'

interface MinesweeperGameProps {
	gameConfig: GameConfig
}

export const MinesweeperGame = ({ gameConfig }: MinesweeperGameProps) => {
	const { params } = gameConfig

	const {
		cell: { size },
		animations: { enabled: animationsEnabled },
	} = useViewConfig()

	const { resetGame, revealCell, toggleFlag, ...gameData } =
		useGame(gameConfig)

	const { time, startTimer, stopTimer, resetTimer } = useTimer()

	const { score, efficiency, updateStatistic, resetStatistic } = useStatistic()

	const {
		animations,
		addAnimations,
		addStaggeredAnimations,
		removeAnimations,
	} = useAnimations(animationsEnabled)

	const { updateStatus, resetStatus } = useGameLifecycle(gameData.status, {
		onPlay(actionSnapshot) {
			startTimer()
		},
		onLose(actionSnapshot) {
			stopTimer()

			// if (animationsEnabled) {
			// 	const baseDuration = animationDuration / 4
			// 	addAnimations(
			// 		actionSnapshot.explodedCells.map(pos => ({
			// 			type: 'explosion',
			// 			position: pos,
			// 		}))
			// 	)
			// 	addStaggeredAnimations(
			// 		actionSnapshot.unmarkedMines.map(pos => ({
			// 			type: 'explosion',
			// 			position: pos,
			// 		})),
			// 		baseDuration
			// 	)
			// 	addStaggeredAnimations(
			// 		actionSnapshot.missedFlags.map(pos => ({
			// 			type: 'flag-missed',
			// 			position: pos,
			// 		})),
			// 		baseDuration,
			// 		baseDuration * actionSnapshot.unmarkedMines.length
			// 	)
			// }
		},
		onWin(actionSnapshot) {
			stopTimer()
		},
	})

	const reset = () => {
		resetTimer()
		resetStatistic()
		resetGame()
		resetStatus()
	}

	const onActionCommitted: ActionCommittedCallback = ({ actionSnapshot }) => {
		updateStatistic({
			revealed: actionSnapshot.revealedCells.length,
			time,
			params,
		})

		updateStatus(actionSnapshot)
	}

	const animatedHandlers = useAnimatedInteraction({
		animations,
		revealCell,
		toggleFlag,
		onActionCommitted,
		addAnimations,
		removeAnimations,
	})

	const directHandlers = useDirectInteraction({
		revealCell,
		toggleFlag,
		onActionCommitted,
	})

	const interactionHandlers = animationsEnabled
		? animatedHandlers
		: directHandlers

	const [width, height] = [params.cols * size, params.rows * size]

	const renderField = () => {
		switch (gameConfig.type) {
			case 'hexagonal':
				// return <HexagonalFieldView ... />;
				return <p>Hexagonal field coming soon!</p>
			case 'triangle':
				// return <TriangleFieldView ... />;
				return <p>Triangle field coming soon!</p>
			case 'square':
			default:
				return (
					<SquareField
						width={width}
						height={height}
						animations={{
							list: animations,
							remove: removeAnimations,
						}}
						field={gameData.field}
						gameOver={gameData.gameOver}
						params={params}
						InteractionWrapper={({ children, getPositionFromEvent }) => (
							<GameFieldHandlers
								className="w-fit cursor-pointer"
								params={params}
								gameOver={gameData.gameOver}
								onCellPress={interactionHandlers.handleCellPress}
								onCellRelease={interactionHandlers.handleCellRelease}
								onToggleFlag={interactionHandlers.handleToggleFlag}
								getPositionFromEvent={getPositionFromEvent}
							>
								{children}
							</GameFieldHandlers>
						)}
					/>
				)
		}
	}

	return <div>{renderField()}</div>
}
