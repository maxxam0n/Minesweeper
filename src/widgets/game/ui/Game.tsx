import { Board, TBoardParams } from '@/features/board'
import { useGame } from '../hooks/useGame'

interface IGameProps {
	boardParams?: TBoardParams
}

const defaultBoardParams: TBoardParams = { cols: 10, rows: 10, mines: 10 }

export const Game = ({ boardParams = defaultBoardParams }: IGameProps) => {
	const onWin = () => console.log('win')
	const onLose = () => console.log('lose')

	const {
		board,
		cellsOpened,
		flagsCount,
		gameStatus,
		isGameOver,
		markCellHandler,
		openCellHandler,
		resetGame,
	} = useGame(boardParams, onWin, onLose)

	return (
		<div className="h-screen flex justify-center items-center">
			<div>
				<button onClick={resetGame}>Заново</button>
				<Board
					board={board}
					size={25}
					isGameOver={isGameOver}
					openCell={openCellHandler}
					markCell={markCellHandler}
				/>
			</div>
		</div>
	)
}
