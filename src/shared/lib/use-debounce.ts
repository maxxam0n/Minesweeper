import { useCallback, useRef } from 'react'

export const useDebounce = (
	fn: (...args: unknown[]) => unknown,
	delay: number
) => {
	const timer = useRef<ReturnType<typeof setTimeout>>()
	return useCallback(
		(...args: unknown[]) => {
			clearTimeout(timer.current)
			timer.current = setTimeout(() => fn.apply(this, args), delay)
		},
		[fn, delay]
	)
}
