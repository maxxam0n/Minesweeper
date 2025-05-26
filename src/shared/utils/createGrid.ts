export const createGrid = <T>(
	rows: number,
	cols: number,
	cb: (y: number, x: number) => T
) => {
	return Array.from({ length: rows }, (_, y) =>
		Array.from({ length: cols }, (_, x) => cb(y, x))
	)
}
