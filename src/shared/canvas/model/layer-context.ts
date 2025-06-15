import { createContext } from 'react'

interface LayerContext {
	registerLayer: (name: string, canvas: HTMLCanvasElement) => void
	unregisterLayer: (name: string) => void
}

export const LayerContext = createContext<LayerContext | null>(null)
