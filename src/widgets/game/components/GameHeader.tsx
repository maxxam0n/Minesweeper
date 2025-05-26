import { GameStatus } from '../hooks/useGame'

interface GameHeaderProps {
	remainingMines: number
	time: number
	gameStatus: GameStatus
	onReset: () => void
}

export const GameHeader = ({
	remainingMines,
	time,
	gameStatus,
	onReset,
}: GameHeaderProps) => {
	const getResetButtonFace = () => {
		switch (gameStatus) {
			case 'win':
				return '😎'
			case 'lose':
				return '😵'
			default:
				return '🙂'
		}
	}

	return (
		<div>
			<div>
				{/* Mine counter */}
				<div>
					<span>{remainingMines.toString().padStart(3, '0')}</span>
				</div>
				{/* Reset button */}
				<button onClick={onReset}>{getResetButtonFace()}</button>
				{/* Timer */}
				<div>
					<span>{time.toString().padStart(3, '0')}</span>
				</div>
			</div>
		</div>
	)
}
