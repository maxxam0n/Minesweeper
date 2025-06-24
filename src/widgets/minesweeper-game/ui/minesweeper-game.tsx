import { useViewConfig } from '@/providers/game-view'
import { SquareField } from '@/entities/field-square'
import { AnimationQuery, useAnimations } from '@/shared/lib/use-animations'
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
				const firstExplosionTime = duration

				const { notFoundMines, explodedCells, errorFlags } = actionSnapshot

				addAnimations(
					actionSnapshot.explodedCells.map(cell => ({
						type: 'explosion',
						position: cell.position,
					}))
				)
				if (notFoundMines.length > 0) {
					const epicenter = explodedCells[0]?.position || {
						col: Math.floor(params.cols / 2),
						row: Math.floor(params.rows / 2),
					}

					// Копируем и сортируем массив неотмеченных мин по расстоянию от эпицентра
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

					// Создаем дескрипторы анимаций из отсортированного массива
					const revealMineAnimations: AnimationQuery[] = sortedMines.map(
						cell => ({
							type: 'explosion',
							position: cell.position,
						})
					)

					const delayBetweenWaves = firstExplosionTime * 0.8
					const waveBatchSize = 5

					addStaggeredAnimations(
						revealMineAnimations,
						delayBetweenWaves,
						waveBatchSize,
						delayBetweenWaves
					)
				}

				// // // 3. Анимация неверных флагов - запускается после того, как все мины взорвались
				// if (errorFlags.length > 0) {
				// 	const totalMineExplosionDuration =
				// 		notFoundMines.length * 20 + 500 // Примерное время, пока все мины не покажутся

				// 	addStaggeredAnimations(
				// 		errorFlags.map(cell => ({
				// 			type: 'flag_missed',
				// 			position: cell.position,
				// 		})),
				// 		50, // Показываем неверные флаги тоже с небольшой задержкой между ними
				// 		totalMineExplosionDuration // Начинаем показывать после основной волны взрывов
				// 	)
				// }
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
