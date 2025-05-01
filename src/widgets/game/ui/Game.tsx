import { useEffect } from 'react'
import { GameField, FieldParams } from '@/modules/game-field'
import { useGame } from '../hooks/useGame'
import { useTimer } from '../hooks/useTimer'
import { useStatistic } from '../hooks/useStatistic'
import { useGameColors } from '../hooks/useGameColors'
import { GameHeader } from './GameHeader'

interface IGameProps {
	config?: FieldParams
}

export const Game = ({
	config = { cols: 50, rows: 30, mines: 200 },
}: IGameProps) => {
	const { time, resetTimer, startTimer, stopTimer } = useTimer()
	const { score, formattedEfficiency, updateStatistic } = useStatistic()

	const onPlay = () => startTimer()
	const onWin = () => stopTimer()
	const onLose = () => stopTimer()
	const onReset = () => resetTimer()

	const {
		field,
		flagsCount,
		gameStatus,
		cellsOpened,
		markCellHandler,
		openCellHandler,
		resetGame,
	} = useGame({ config, onPlay, onWin, onLose, onReset })

	useEffect(() => {
		updateStatistic({ cellsOpened, time, config })
	}, [cellsOpened, time, config])

	const gameColors = useGameColors()

	const remainingMines = config.mines - flagsCount

	return (
		<div>
			<div>
				<GameHeader
					remainingMines={remainingMines}
					time={time}
					gameStatus={gameStatus}
					onReset={resetGame}
				/>
				<div>
					<span>Score:</span> {score} | <span>Cells:</span> {cellsOpened} |{' '}
					<span>Efficiency:</span> {formattedEfficiency}
				</div>
				<div>
					<GameField
						type="svg"
						colors={gameColors}
						field={field}
						cellSize={25}
						isGameOver={gameStatus === 'lose'}
						openCell={openCellHandler}
						markCell={markCellHandler}
					/>
				</div>
			</div>
		</div>
	)
}
