import { createContext } from 'react'

export const TextMetricsCacheContext = createContext<Map<
	string,
	TextMetrics
> | null>(null)
