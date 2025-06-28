import { PropsWithChildren, useMemo, useState } from 'react'
import { useThemeValue } from '@/providers/color-theme'
import { useFont } from '@/shared/lib/use-font'
import { GAME_COLORS, GameColors, GameSettings } from './types'
import { GameSettingsContext } from './game-settings-context'
import { DARK_COLORS, LIGHT_COLORS } from './constants'

export const GameSettingsProvider = ({ children }: PropsWithChildren) => {
	const [font, setFont] = useState('Tektur')
	const [darkColors, setDarkColors] = useState(DARK_COLORS)
	const [lightColors, setLightColors] = useState(LIGHT_COLORS)

	const [cellParams, setCellParams] = useState({
		size: 30,
		bevelWidth: 3,
		borderWidth: 0.5,
	})

	const [animationsParams, setAnimationsParams] = useState({
		enabled: true,
		duration: 500,
	})

	const { isDark } = useThemeValue()
	const { errorLoadingFont, isFontLoading } = useFont(font)

	const colors: GameColors = useMemo(() => {
		return Object.keys(GAME_COLORS).reduce((acc, key) => {
			const lightColor = lightColors[key as keyof GameColors]
			const darkColor = darkColors[key as keyof GameColors]

			acc[key as keyof GameColors] = isDark ? darkColor : lightColor

			return acc
		}, {} as any)
	}, [isDark, lightColors, darkColors])

	const gameSettings = useMemo<GameSettings>(() => {
		const safeFont = errorLoadingFont || isFontLoading ? 'monospace' : font

		return {
			cell: { font: safeFont, ...cellParams },
			animations: animationsParams,
			colors,
		}
	}, [
		font,
		colors,
		cellParams,
		animationsParams,
		errorLoadingFont,
		isFontLoading,
		animationsParams,
	])

	const provided = useMemo(
		() => ({ settings: gameSettings, initialized: !isFontLoading }),
		[gameSettings]
	)

	return (
		<GameSettingsContext.Provider value={provided}>
			{children}
		</GameSettingsContext.Provider>
	)
}
