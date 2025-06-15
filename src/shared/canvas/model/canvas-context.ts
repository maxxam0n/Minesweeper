import { createContext } from 'react'
import { ShapeDrawingData } from '../lib/types'

interface CanvasContext {
	setShape: (shapeData: ShapeDrawingData) => void
	removeShape: (shapeData: ShapeDrawingData) => void
}

export const CanvasContext = createContext<CanvasContext | null>(null)
