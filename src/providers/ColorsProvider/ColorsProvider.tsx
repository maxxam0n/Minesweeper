import { PropsWithChildren } from 'react'
import { FieldColorsEnum } from '@/modules/game-field'
import { useThemeValue } from '../ThemeProvider'
import { AppColorsEnum, ColorsContext } from './ColorsContext'

export const AppColorsProvider = ({ children }: PropsWithChildren) => {
	const { isDark } = useThemeValue()
	const styles = getComputedStyle(document.documentElement)

	const colors: Record<AppColorsEnum | FieldColorsEnum, string> = {
		PRIMARY: styles.getPropertyValue('--color-primary'),
		SECONDARY: styles.getPropertyValue('--color-secondary'),
		LIGHT: styles.getPropertyValue('--color-light'),
		LIGHT_LIGHT: styles.getPropertyValue('--color-light-light'),
		DARK: styles.getPropertyValue('--color-dark'),
		DARK_DARK: styles.getPropertyValue('--color-dark-dark'),
		GREY_MAIN: styles.getPropertyValue('--color-grey-main'),
		GREY_LIGHT: styles.getPropertyValue('--color-grey-light'),
		GREY_MIDDLE: styles.getPropertyValue('--color-grey-middle'),
		GREY_DARK: styles.getPropertyValue('--color-grey-dark'),

		// field colors
		CLOSED: isDark ? '#1f2e3c' : '#c0c0c0',
		REVEALED: isDark ? '#303a48' : '#ffffff',
		BORDER: isDark ? '#4a5466' : '#808080',
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
	}

	return (
		<ColorsContext.Provider value={colors}>{children}</ColorsContext.Provider>
	)
}
