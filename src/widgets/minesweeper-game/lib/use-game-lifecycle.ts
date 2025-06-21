import { useRef } from 'react'
import { GameSnapshot, GameStatus } from '@/engine'

interface LifecycleMethods {
	onPlay: (actionSnapshot: GameSnapshot) => void
	onWin: (actionSnapshot: GameSnapshot) => void
	onLose: (actionSnapshot: GameSnapshot) => void
}

export const useGameLifecycle = (
	initialStatus: GameStatus,
	{ onPlay, onWin, onLose }: LifecycleMethods
) => {
	const lastStatus = useRef(initialStatus)

	const updateStatus = (actionSnapshot: GameSnapshot) => {
		if (lastStatus.current !== actionSnapshot.status) {
			lastStatus.current = actionSnapshot.status
			if (actionSnapshot.status === GameStatus.Playing) {
				onPlay(actionSnapshot)
			} else if (actionSnapshot.status === GameStatus.Won) {
				onWin(actionSnapshot)
			} else if (actionSnapshot.status === GameStatus.Lost) {
				onLose(actionSnapshot)
			}
		}
	}

	const resetStatus = () => {
		lastStatus.current = initialStatus
	}

	return { updateStatus, resetStatus }
}
