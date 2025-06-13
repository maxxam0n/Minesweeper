export const random = (max: number) => Math.floor(Math.random() * max)

export const createGrid = <T>(
	rows: number,
	cols: number,
	cb: ({ row, col }: { row: number; col: number }) => T
) => {
	return Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => cb({ row, col }))
	)
}
