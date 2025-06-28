export const parseToNumber = (num: unknown) => {
	const anyAsNumber = Number(num)
	if (!isNaN(anyAsNumber)) return anyAsNumber
	else return 0
}

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
		if (document.fonts.check(fontSpecifier)) return true
	}

	try {
		await document.fonts.load(fontSpecifier)
		// Дополнительная проверка, так как load может разрешиться, даже если шрифт не применился
		if (document.fonts.check(fontSpecifier)) {
			return true
		} else throw new Error('Font not loaded')
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error loading font "${fontSpecifier}":`, error)
			throw new Error(error.message)
		} else return false
	}
}
