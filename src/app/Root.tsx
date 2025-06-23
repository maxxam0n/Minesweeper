import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/providers/color-theme'

import './styles/index.css'

export const Root = () => {
	return (
		<ThemeProvider>
			<Outlet />
		</ThemeProvider>
	)
}
