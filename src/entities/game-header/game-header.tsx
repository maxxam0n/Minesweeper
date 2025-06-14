import { GameStatus } from '@/engine'

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
			case GameStatus.Won:
				return '😎'
			case GameStatus.Lost:
				return '😵'
			default:
				return '🙂'
		}
	}

	return (
		<div>
			<div>
				<div>{remainingMines.toString().padStart(3, '0')}</div>
				<button onClick={onReset}>{getResetButtonFace()}</button>
				<div>{time.toString().padStart(3, '0')}</div>
			</div>
		</div>
	)
}
