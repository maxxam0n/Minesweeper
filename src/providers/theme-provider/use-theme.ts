import { useContext } from 'react'
import { ThemeContext } from './theme-context'

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

export const useThemeValue = () => {
	const { theme } = useTheme()
	const isDark = theme === 'dark'
	const isLight = theme === 'light'

	return { isDark, isLight }
}
