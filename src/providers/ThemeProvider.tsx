import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react'

type Theme = 'light' | 'dark'

export type ThemeContextType = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const storageKey = 'theme'

const getInitialTheme = (): Theme => {
	const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	let theme: Theme =
		(localStorage.getItem(storageKey) as Theme) ?? (isDark ? 'dark' : 'light')
	return theme
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	useEffect(() => {
		document.documentElement.dataset.theme = theme
		localStorage.setItem(storageKey, theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

export const useThemeValue = () => {
	const { theme } = useTheme()
	return theme
}
