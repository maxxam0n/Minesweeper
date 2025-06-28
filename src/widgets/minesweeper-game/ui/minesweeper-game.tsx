import { forwardRef, Ref, useImperativeHandle } from 'react'
import { CellData } from '@/engine'
import { useGameSettings } from '@/providers/game-settings'
import { FieldPropsProvider } from '@/providers/field-props'
import { SquareField } from '@/entities/square-field'
import { useAnimations } from '@/shared/lib/use-animations'
import { useGame } from '../lib/use-game'
import { useTimer } from '../lib/use-timer'
import { useStatistic } from '../lib/use-statistic'
import { ActionCommittedCallback, GameExpose, URLConfig } from '../lib/types'
import { useGameLifecycle } from '../lib/use-game-lifecycle'
import { useAnimatedInteraction } from '../lib/use-animated-interaction'
import { useDirectInteraction } from '../lib/use-direct-interaction'
import { useSolver } from '../lib/use-solver'
import { useAnimatedGameOver } from '../lib/use-animated-game-over'

interface MinesweeperGameProps {
	config: URLConfig
	withSolver?: boolean
	withDebug?: boolean
	data?: CellData[][]
}

export const MinesweeperGame = forwardRef(
	(
		{ config, data, withSolver, withDebug }: MinesweeperGameProps,
		ref: Ref<GameExpose>
	) => {
		const { params, type } = config

		const {
			initialized,
			settings: {
				cell: { size },
				animations: { enabled: animationsEnabled, duration },
			},
		} = useGameSettings()

		// Хук использующий апи движка сапера, связующее звено между логикой игры,
		// логики, строящейся поверх игры (solver, статистика, анимации)
		// и отображения ui
		const { resetGame, revealCell, toggleFlag, flagsRemaining, ...gameData } =
			useGame({
				...config,
				data,
			})

		// Обычный таймер
		const { time, startTimer, stopTimer, resetTimer } = useTimer()

		// Расчет статистики
		const { score, efficiency, updateStatistic, resetStatistic } =
			useStatistic()

		// Расчет вероятностей на основе снимка поля
		const { probabilities, connectedRegions, findRegions, solve } = useSolver(
			{
				data: gameData.field,
				params,
				type,
			}
		)

		// Для регистрации анимированных действий
		const { animations, addAnimations, removeAnimations } = useAnimations()

		// Анимации победы и поражения
		const { animateLose, animateWin } = useAnimatedGameOver({
			duration,
			params,
			addAnimations,
		})

		// Логика жизненного цикла игры
		const { updateStatus, resetStatus } = useGameLifecycle(gameData.status, {
			onPlay() {
				startTimer()
			},
			onLose(actionSnapshot) {
				stopTimer()
				if (animationsEnabled) {
					animateLose(actionSnapshot)
				}
			},
			onWin(actionSnapshot) {
				stopTimer()
				if (animationsEnabled) {
					animateWin(actionSnapshot)
				}
			},
		})

		// Апи компонента
		const reset = () => {
			resetTimer()
			resetStatistic()
			resetGame()
			resetStatus()
		}

		// Обработка клика на клетку (только левый клик, правые не обрабатываются)
		const onActionCommitted: ActionCommittedCallback = ({
			actionSnapshot,
		}) => {
			if (withSolver) solve(actionSnapshot.field)
			if (withDebug) findRegions(actionSnapshot.field)
			updateStatus(actionSnapshot)
			updateStatistic({
				revealed: actionSnapshot.revealedCells.length,
				time,
				params,
			})
		}

		// Обработчики кликов, запускающие анимации
		const animatedHandlers = useAnimatedInteraction({
			duration,
			animations,
			revealCell,
			toggleFlag,
			onActionCommitted,
			addAnimations,
			removeAnimations,
		})

		// Обычные обработчики кликов
		const directHandlers = useDirectInteraction({
			revealCell,
			toggleFlag,
			onActionCommitted,
		})

		// На основе animationsEnabled используем анимированные или не анимированные действия
		const { handleCellPress, handleCellRelease, handleToggleFlag } =
			animationsEnabled ? animatedHandlers : directHandlers

		// Компонент предоставляет способ себя обнулить
		useImperativeHandle(
			ref,
			() => ({
				reset,
				score,
				efficiency,
				time,
				flagsRemaining,
			}),
			[reset, score, efficiency, time, flagsRemaining]
		)

		if (!initialized) return <div>Инициализация...</div>

		return (
			<FieldPropsProvider
				size={size}
				params={params}
				showProbabilities={withSolver}
				showConnectedRegions={withDebug}
				gameOver={gameData.gameOver}
				removeAnimations={removeAnimations}
				interactions={{
					onCellPress: handleCellPress,
					onCellRelease: handleCellRelease,
					onToggleFlag: handleToggleFlag,
				}}
			>
				{type === 'square' && (
					<SquareField
						field={gameData.field}
						animationsList={animations}
						probabilities={probabilities}
						connectedRegions={connectedRegions}
					/>
				)}
			</FieldPropsProvider>
		)
	}
)
