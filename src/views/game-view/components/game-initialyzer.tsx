import { useState, useEffect } from 'react'
import { ensureFontIsReady } from '@/shared/services/font-loader'
import { GameViewContent } from './game-view-content'

const REQUIRED_FONT_SPECIFIER = '16px Tektur'

export const GameInitializer = () => {
	const [isFontLoaded, setIsFontLoaded] = useState(false)
	const [errorLoadingFont, setErrorLoadingFont] = useState(false)

	useEffect(() => {
		let isActive = true
		ensureFontIsReady(REQUIRED_FONT_SPECIFIER)
			.then(success => {
				if (isActive) {
					if (success) {
						setIsFontLoaded(true)
					} else {
						// Эта ветка сейчас не достигается, т.к. ensureFontIsReady всегда возвращает true
						// Но можно доработать, если нужно различать успешную загрузку и фолбэк
						setErrorLoadingFont(true) // Или просто setIsFontLoaded(true) для фолбэка
					}
				}
			})
			.catch(() => {
				// На случай, если промис в ensureFontIsReady будет отклонен
				if (isActive) {
					setErrorLoadingFont(true)
					// setIsFontLoaded(true); // Можно все равно разрешить рендер с фолбэком
				}
			})

		return () => {
			isActive = false
		}
	}, [])

	if (errorLoadingFont) {
		// Можно показать сообщение об ошибке или отрендерить игру с системным шрифтом
		// return <GameViewContent fontReady={false} />; // Передать флаг, если нужно
		return (
			<p>
				Ошибка загрузки основного шрифта. Игра может отображаться
				некорректно.
			</p>
		)
	}

	if (!isFontLoaded) {
		return <p>Загрузка игры...</p>
	}

	return <GameViewContent />
}
