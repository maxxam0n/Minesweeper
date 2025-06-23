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

interface MinesweeperGameProps {
	config: GameConfig
}

export const MinesweeperGame = ({ config }: MinesweeperGameProps) => {
	const { params, type } = config

	const {
		cell: { size },
		animations: { enabled: animationsEnabled, duration },
	} = useViewConfig()

	const [width, height] = [params.cols * size, params.rows * size]

	const { resetGame, revealCell, toggleFlag, ...gameData } = useGame(config)
	const { time, startTimer, stopTimer, resetTimer } = useTimer()
	const { score, efficiency, updateStatistic, resetStatistic } = useStatistic()

	const {
		animations,
		addAnimations,
		removeAnimations,
		addStaggeredAnimations,
	} = useAnimations(animationsEnabled)

	const { updateStatus, resetStatus } = useGameLifecycle(gameData.status, {
		onPlay() {
			startTimer()
		},
		onLose(actionSnapshot) {
			stopTimer()

			if (animationsEnabled) {
				const baseDuration = duration / 4
				addAnimations(
					actionSnapshot.explodedCells.map(cell => ({
						type: 'explosion',
						position: cell.position,
					}))
				)
				addStaggeredAnimations(
					actionSnapshot.notFoundMines.map(cell => ({
						type: 'explosion',
						position: cell.position,
					})),
					baseDuration
				)
				addStaggeredAnimations(
					actionSnapshot.errorFlags.map(cell => ({
						type: 'flag-missed',
						position: cell.position,
					})),
					baseDuration,
					baseDuration * actionSnapshot.notFoundMines.length
				)
			}
		},
		onWin() {
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

	const { handleCellPress, handleCellRelease, handleToggleFlag } =
		animationsEnabled ? animatedHandlers : directHandlers

	return (
		<>
			{type === 'square' && (
				<SquareField
					params={params}
					field={gameData.field}
					gameOver={gameData.gameOver}
					width={width}
					height={height}
					animationsList={animations}
					removeAnimations={removeAnimations}
					onCellPress={handleCellPress}
					onCellRelease={handleCellRelease}
					onToggleFlag={handleToggleFlag}
				/>
			)}
		</>
	)
}
