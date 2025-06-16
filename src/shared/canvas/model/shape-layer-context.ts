import { createContext } from 'react'

interface ShapeLayerContext {
	name: string
	opacity: number
}

export const ShapeLayerContext = createContext<ShapeLayerContext | null>(null)
