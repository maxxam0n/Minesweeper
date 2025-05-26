import { PropsWithChildren, useEffect, useState } from 'react'
import { Theme, ThemeContext } from './ThemeContext'

const storageKey = 'theme'

const getInitialTheme = (): Theme => {
	const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	return (
		(localStorage.getItem(storageKey) as Theme) ?? (isDark ? 'dark' : 'light')
	)
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
