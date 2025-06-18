export async function ensureFontIsReady(
	fontSpecifier: string
): Promise<boolean> {
	const genericFamilies = [
		'serif',
		'sans-serif',
		'monospace',
		'cursive',
		'fantasy',
		'system-ui',
	]
	const isGeneric = genericFamilies.some(family =>
		fontSpecifier.includes(family)
	)
	if (
		isGeneric &&
		!fontSpecifier.toLowerCase().includes('bold') &&
		!fontSpecifier.toLowerCase().includes('italic')
	) {
		// Если это базовый системный шрифт без стилей, считаем его сразу готовым
		// (document.fonts.check может некорректно работать для них без явного @font-face)
		if (document.fonts.check(fontSpecifier)) return true
	}

	try {
		await document.fonts.load(fontSpecifier)
		// Дополнительная проверка, так как load может разрешиться, даже если шрифт не применился
		if (document.fonts.check(fontSpecifier)) {
			return true
		} else {
			console.warn(
				`Font "${fontSpecifier}" loaded but check failed. Using fallback.`
			)
			return true
		}
	} catch (error) {
		console.error(`Error loading font "${fontSpecifier}":`, error)
		return true // Разрешаем с ошибкой, чтобы не блокировать
	}
}
