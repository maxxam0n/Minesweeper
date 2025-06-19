import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/providers/theme-provider'

import './styles/index.css'

export const Root = () => {
	return (
		<ThemeProvider>
			<Outlet />
		</ThemeProvider>
	)
}
