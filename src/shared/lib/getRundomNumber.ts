/**
 * Генерирует случайное целое число от 0 (включительно) до max (не включительно).
 *
 * @param {number} max Верхняя граница диапазона (не включается в результат). Должно быть положительное число.
 * @returns {number} Случайное целое число в диапазоне [0, max).
 *                   Возвращает 0, если max <= 0.
 */
export const getRandomNumber = (max: number) => {
	return Math.floor(Math.random() * max)
}
