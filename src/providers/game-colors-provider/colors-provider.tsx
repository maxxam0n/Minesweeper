import { PropsWithChildren, useMemo } from 'react'
import { useThemeValue } from '../theme-provider'
import { GameColorsContext } from './colors-context'
import { GameColors } from './types'

export const GameColorsProvider = ({ children }: PropsWithChildren) => {
	const { isDark } = useThemeValue()

	const colors: GameColors = useMemo(() => ({
		CLOSED: isDark ? '#1f2e3c' : '#c0c0c0',
		REVEALED: isDark ? '#303a48' : '#ffffff',
		BORDER: isDark ? '#414d5e' : '#808080',
		EXPLODED: isDark ? '#660000' : '#ff4444',
		EXPLODED_BORDER: isDark ? '#770000' : '#ff0000',
		MISSED: isDark ? '#333338' : '#d0b0b0',
		LIGHT_BEVEL: isDark ? '#4a5466' : '#ffffff',
		DARK_BEVEL: isDark ? '#171c23' : '#808080',
		MINE: isDark ? '#000000' : '#000000',
		FLAG: isDark ? '#ff4444' : '#ff4444',
		FLAG_SHAFT: isDark ? '#aaaaaa' : '#888888',
		1: isDark ? '#4a90e2' : '#0000ff',
		2: isDark ? '#4caf50' : '#008000',
		3: isDark ? '#f44336' : '#ff0000',
		4: isDark ? '#3f51b5' : '#000080',
		5: isDark ? '#9c27b0' : '#800000',
		6: isDark ? '#00bcd4' : '#008080',
		7: isDark ? '#ffffff' : '#000000',
		8: isDark ? '#9e9e9e' : '#808080',
	}), [isDark])

	return (
		<GameColorsContext.Provider value={colors}>
			{children}
		</GameColorsContext.Provider>
	)
}
