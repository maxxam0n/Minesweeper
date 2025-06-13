import { createContext } from 'react'
import { GameColors } from './types'

export const GameColorsContext = createContext<GameColors | null>(null)
