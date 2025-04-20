import { useRef, useState } from 'react'

export const useTimer = () => {
	const timer = useRef<ReturnType<typeof setInterval>>()
	const [startTime, setStartTime] = useState(0)
	const [time, setTime] = useState(0)

	const startTimer = () => {
		setStartTime(Date.now())
		timer.current = setInterval(() => {
			setTime(Date.now() - startTime)
		}, 1000)
	}

	const stopTimer = () => {
		clearInterval(timer.current)
		setStartTime(0)
		setTime(0)
	}

	return { startTimer, stopTimer }
}
