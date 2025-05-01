/**
 * Генерирует случайное целое число от 0 (включительно) до max (не включительно).
 * @param {number} max (max >= 0) Верхняя граница диапазона.
 * @returns {number} Случайное целое число в диапазоне [0, max).
 */
export const getRandomNumber = (max: number) => {
	return Math.floor(Math.random() * max)
}
