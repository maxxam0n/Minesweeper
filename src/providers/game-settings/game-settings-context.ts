import { createContext } from 'react'
import { GameSettings } from './types'

type ThemeContextType = {
	settings: GameSettings
	initialized: boolean
}

export const GameSettingsContext = createContext<ThemeContextType | null>(null)
