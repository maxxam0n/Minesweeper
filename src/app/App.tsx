import { Game } from '@/widgets/game'
import { AppColorsProvider } from '@/providers/ColorsProvider'
import { useThemeValue } from '@/providers/ThemeProvider'

import './styles/index.css'

export const App = () => {
	const theme = useThemeValue()

	return (
		<AppColorsProvider theme={theme}>
			<Game />
		</AppColorsProvider>
	)
}
