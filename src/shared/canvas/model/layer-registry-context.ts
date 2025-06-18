import { createContext } from 'react'

interface LayerContext {
	registerLayer: (
		name: string,
		canvas: HTMLCanvasElement,
		opacity?: number
	) => void
	unregisterLayer: (name: string) => void
}

export const LayerRegistryContext = createContext<LayerContext | null>(null)
