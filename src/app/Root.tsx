import { Outlet } from 'react-router-dom'
import { AppColorsProvider } from '@/providers/ColorsProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

import './styles/index.css'

export const Root = () => {
	return (
		<ThemeProvider>
			<AppColorsProvider>
				<Outlet />
			</AppColorsProvider>
		</ThemeProvider>
	)
}
