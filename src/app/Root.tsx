import { Outlet } from 'react-router-dom'
import { GameColorsProvider } from '@/providers/game-colors-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './styles/index.css'

export const Root = () => {
	return (
		<ThemeProvider>
			<GameColorsProvider>
				<Outlet />
			</GameColorsProvider>
		</ThemeProvider>
	)
}
