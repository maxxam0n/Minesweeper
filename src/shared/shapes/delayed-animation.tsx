import { memo, ReactNode, useEffect, useState } from 'react'

interface DelayedAnimationProps {
	delay: number
	fallback: ReactNode
	children: ReactNode
}

export const DelayedAnimation = memo(
	({ delay, fallback, children }: DelayedAnimationProps) => {
		const [isWaiting, setIsWaiting] = useState(true)

		useEffect(() => {
			if (delay <= 0) {
				setIsWaiting(false)
				return
			}

			const timerId = setTimeout(() => {
				setIsWaiting(false) // Задержка прошла, переключаем на основную анимацию
			}, delay)

			return () => {
				clearTimeout(timerId)
			}
		}, [delay])

		if (isWaiting) {
			return <>{fallback}</>
		}

		return <>{children}</>
	}
)
