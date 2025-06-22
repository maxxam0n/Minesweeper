import { useViewConfig } from '@/providers/game-view-provider'
import { Canvas } from '@/shared/canvas'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { ActionCommittedCallback, GameConfig } from '../lib/types'
import { useAnimations } from '../lib/use-animations'
import { useGameLifecycle } from '../lib/use-game-lifecycle'
import { useAnimatedInteraction } from '../lib/use-animated-interaction'
import { useDirectInteraction } from '../lib/use-direct-interaction'
import { GameField } from './game-field'
import { AnimationField } from './animation-field'
import { GameFieldHandlers } from './game-field-handlers'
import { FieldGrid } from './field-grid'

interface IGameProps {
	gameConfig: GameConfig
}

export const MinesweeperGame = ({ gameConfig }: IGameProps) => {
	const { params } = gameConfig

	const { cellSize, animationDuration, animationsEnabled } = useViewConfig()

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

	const [width, height] = [params.cols * cellSize, params.rows * cellSize]

	return (
		<GameFieldHandlers
			className="w-fit cursor-pointer"
			params={params}
			isGameOver={gameData.gameOver}
			onCellPress={interactionHandlers.handleCellPress}
			onCellRelease={interactionHandlers.handleCellRelease}
			onToggleFlag={animatedHandlers.handleToggleFlag}
		>
			<Canvas width={width} height={height}>
				<GameField
					zIndex={0}
					width={width}
					height={height}
					data={gameData.field}
				/>
				{animationsEnabled && (
					<AnimationField
						zIndex={10}
						animations={animations}
						onAnimationComplete={removeAnimations}
					/>
				)}
				<FieldGrid
					params={params}
					height={height}
					width={width}
					zIndex={20}
				/>
			</Canvas>
		</GameFieldHandlers>
	)
}
