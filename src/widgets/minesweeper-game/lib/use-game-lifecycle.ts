import { useRef } from 'react'
import { GameStatus } from '@/engine'

interface LifecycleMethods {
	onPlay: () => void
	onWin: () => void
	onLose: () => void
}

export const useGameLifecycle = (
	initialStatus: GameStatus,
	{ onPlay, onWin, onLose }: LifecycleMethods
) => {
	const lastStatus = useRef(initialStatus)

	const updateStatus = (status: GameStatus) => {
		if (lastStatus.current !== status) {
			if (status === GameStatus.Playing) onPlay()
			else if (status === GameStatus.Won) onWin()
			else if (status === GameStatus.Lost) onLose()
			lastStatus.current = status
		}
	}

	return { updateStatus }
}
