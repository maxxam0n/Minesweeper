import { useViewConfig } from '@/providers/game-view-provider'
import { GameStatus } from '@/engine'
import { Canvas } from '@/shared/canvas'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { ApplyRevealFunction, GameConfig } from '../lib/types'
import { useAnimations } from '../lib/use-animations'
import { useGameLifecycle } from '../lib/use-game-lifecycle'
import { GameField } from './game-field'
import { AnimationField } from './animation-field'
import { GameFieldHandlers } from './game-field-handlers'
import { useAnimatedInteraction } from '../lib/use-animated-interaction'
import { useDirectInteraction } from '../lib/use-direct-interaction'

interface IGameProps {
	gameConfig: GameConfig
}

export const MinesweeperGame = ({ gameConfig }: IGameProps) => {
	const { params } = gameConfig

	const { cellSize, animationsEnabled } = useViewConfig()

	const { resetGame, revealCell, toggleFlag, ...gameData } =
		useGame(gameConfig)

	const { time, startTimer, stopTimer, resetTimer } = useTimer()

	const { score, efficiency, updateStatistic, resetStatistic } = useStatistic()

	const { updateStatus } = useGameLifecycle(gameData.status, {
		onPlay() {
			startTimer()
		},
		onLose() {
			stopTimer()
		},
		onWin() {
			stopTimer()
		},
	})

	const { animations, addAnimations, removeAnimations } =
		useAnimations(animationsEnabled)

	const reset = () => {
		resetTimer()
		resetStatistic()
		resetGame()
		updateStatus(GameStatus.Idle)
	}

	const onApplyReveal: ApplyRevealFunction = ({ actionSnapshot }) => {
		updateStatistic({ revealed: actionSnapshot.revealed, time, params })
		updateStatus(actionSnapshot.status)
	}

	const animatedHandlers = useAnimatedInteraction({
		animations,
		revealCell,
		onApplyReveal,
		addAnimations,
		removeAnimations,
	})

	const directHandlers = useDirectInteraction({
		revealCell,
		onApplyReveal,
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
			onToggleFlag={toggleFlag}
		>
			<Canvas width={width} height={height}>
				<GameField
					params={params}
					width={width}
					height={height}
					data={gameData.field}
				/>
				{animationsEnabled && (
					<AnimationField
						animations={animations}
						onAnimationComplete={removeAnimations}
					/>
				)}
			</Canvas>
		</GameFieldHandlers>
	)
}
