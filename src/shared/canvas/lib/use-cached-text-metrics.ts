import { useState, useEffect, useContext } from 'react'
import { MeasureContext } from '../model/measure-context'
import { TextMetricsCacheContext } from '../model/metrics-cache-context'

export function useCachedTextMetrics(
	text: string,
	font: string
): TextMetrics | null {
	const measureCtx = useContext(MeasureContext)
	const cache = useContext(TextMetricsCacheContext) // Получаем кэш из контекста
	const [metrics, setMetrics] = useState<TextMetrics | null>(null)

	useEffect(() => {
		if (!measureCtx || !cache || !text || !font) {
			setMetrics(null)
			return
		}

		const cacheKey = `${font}_${text}`

		if (cache.has(cacheKey)) {
			setMetrics(cache.get(cacheKey)!)
		} else {
			measureCtx.font = font
			const newMetrics = measureCtx.measureText(text)
			cache.set(cacheKey, newMetrics)
			setMetrics(newMetrics)
		}
	}, [text, font, measureCtx, cache])

	return metrics
}
