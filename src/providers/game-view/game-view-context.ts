import { createContext } from 'react'
import { ViewConfig } from './types'

export const GameViewContext = createContext<ViewConfig | null>(null)
