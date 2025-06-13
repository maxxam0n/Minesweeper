import { createContext } from 'react'
import { SetShape, RemoveShape } from '../lib/types'

export const CanvasContext = createContext<{
	setShape: SetShape
	removeShape: RemoveShape
}>({
	setShape() {},
	removeShape() {},
})
