import { useEffect, useState } from 'react'
import { ensureFontIsReady } from './helpers'

export const useFont = (font: string) => {
	const [errorLoadingFont, setErrorLoadingFont] = useState(false)
	const [isFontLoading, setIsFontLoading] = useState(true)

	useEffect(() => {
		ensureFontIsReady(font)
			.then(success => setErrorLoadingFont(!success))
			.catch(() => setErrorLoadingFont(true))
			.finally(() => setIsFontLoading(false))
	}, [font])

	return { isFontLoading, errorLoadingFont }
}
