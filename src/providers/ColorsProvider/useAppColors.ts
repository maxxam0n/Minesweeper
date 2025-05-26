import { useContext } from 'react'
import { ColorsContext } from './ColorsContext'

export const useAppColors = () => {
	const colors = useContext(ColorsContext)
	if (!colors) {
		throw new Error('Ошибка получения цветовой палитры приложения')
	}

	return colors
}
