import { useRef, useState, useEffect } from 'react'

export const useTimer = () => {
	const timer = useRef<ReturnType<typeof setInterval> | null>(null)
	const startTimeRef = useRef<number | null>(null)
	const [time, setTime] = useState<number>(0)

	const updateDisplayedTime = () => {
		if (startTimeRef.current) {
			const elapsedMilliseconds = Date.now() - startTimeRef.current
			const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
			setTime(elapsedSeconds)
		}
	}

	const startTimer = () => {
		if (timer.current) {
			clearInterval(timer.current)
		}
		startTimeRef.current = Date.now()
		setTime(0)
		timer.current = setInterval(updateDisplayedTime, 1000)
	}

	const stopTimer = () => {
		if (timer.current) {
			clearInterval(timer.current)
			timer.current = null
		}
	}

	const resetTimer = () => {
		stopTimer()
		startTimeRef.current = null
		setTime(0)
	}

	useEffect(() => {
		return () => {
			if (timer.current) clearInterval(timer.current)
		}
	}, [])

	return { startTimer, stopTimer, resetTimer, time }
}
