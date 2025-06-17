import { createContext } from 'react'
import { LayerRemovalStrategy } from '../lib/types'

interface LayerContext {
	registerLayer: (
		name: string,
		canvas: HTMLCanvasElement,
		strategy: LayerRemovalStrategy
	) => void
	unregisterLayer: (name: string) => void
}

export const LayerContext = createContext<LayerContext | null>(null)
