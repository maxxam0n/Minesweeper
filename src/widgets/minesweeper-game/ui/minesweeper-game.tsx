import { CellData } from '@/engine'
import { useViewConfig } from '@/providers/game-view'
import { SquareField } from '@/entities/field-square'
import { useAnimations } from '@/shared/lib/use-animations'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { ActionCommittedCallback, URLConfig } from '../lib/types'
import { useGameLifecycle } from '../lib/use-game-lifecycle'
import { useAnimatedInteraction } from '../lib/use-animated-interaction'
import { useDirectInteraction } from '../lib/use-direct-interaction'
import { useSolver } from '../lib/use-solver'

interface MinesweeperGameProps {
	config: URLConfig
	withSolver?: boolean
	data?: CellData[][]
}

export const MinesweeperGame = ({ config, data }: MinesweeperGameProps) => {
	const { params, type } = config

	const {
		cell: { size },
		animations: { enabled: animationsEnabled, duration },
	} = useViewConfig()

	const [width, height] = [params.cols * size, params.rows * size]

	const { 
		resetGame, 
		revealCell, 
		toggleFlag, 
		...gameData 
	} = useGame({ ...config, data })

	const { time, startTimer, stopTimer, resetTimer } = useTimer()
	const { score, efficiency, updateStatistic, resetStatistic } = useStatistic()

	const { probabilities, connectedRegions, findRegions, solve } = useSolver({
		data: gameData.field,
		params,
		type,
	})

	const { animations, addAnimations, removeAnimations } =
		useAnimations(animationsEnabled)

	const { updateStatus, resetStatus } = useGameLifecycle(gameData.status, {
		onPlay() {
			startTimer()
		},
		onLose(actionSnapshot) {
			stopTimer()

			if (animationsEnabled) {
				const firstExplosionTime = duration

				const { notFoundMines, explodedCells, errorFlags } = actionSnapshot

				addAnimations(
					actionSnapshot.explodedCells.map(cell => ({
						type: 'explosion',
						position: cell.position,
						duration,
					}))
				)

				if (notFoundMines.length > 0) {
					const epicenter = explodedCells[0]?.position || {
						col: Math.floor(params.cols / 2),
						row: Math.floor(params.rows / 2),
					}

					const sortedMines = [...notFoundMines].sort((a, b) => {
						const distA = Math.hypot(
							a.position.col - epicenter.col,
							a.position.row - epicenter.row
						)
						const distB = Math.hypot(
							b.position.col - epicenter.col,
							b.position.row - epicenter.row
						)
						return distA - distB
					})

					addAnimations(
						sortedMines.slice(0, 5).map(cell => ({
							type: 'explosion',
							position: cell.position,
							duration,
						}))
					)

					addAnimations(
						sortedMines.slice(5).map((cell, index) => ({
							type: 'reveal',
							position: cell.position,
							delay: index * 5,
							duration,
						}))
					)
				}

				if (errorFlags.length > 0) {
					addAnimations(
						errorFlags.map(cell => ({
							type: 'error',
							position: cell.position,
							delay: firstExplosionTime * 2,
							duration,
						}))
					)
				}
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
		solve(actionSnapshot.field)
		findRegions(actionSnapshot.field)
		updateStatus(actionSnapshot)
		updateStatistic({
			revealed: actionSnapshot.revealedCells.length,
			time,
			params,
		})
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
					probabilities={probabilities}
					showProbabilities={true}
					showConnectedRegions={false}
					connectedRegions={connectedRegions}
					removeAnimations={removeAnimations}
					onCellPress={handleCellPress}
					onCellRelease={handleCellRelease}
					onToggleFlag={handleToggleFlag}
				/>
			)}
		</>
	)
}
