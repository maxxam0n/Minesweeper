import { useContext } from 'react'
import { GameColorsContext } from './colors-context'

export const useGameColors = () => {
	const colors = useContext(GameColorsContext)
	if (!colors) {
		throw new Error('Ошибка получения цветовой палитры приложения')
	}

	return colors
}
