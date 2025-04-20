export const createArray = <T>(length: number, cb: (index: number) => T) => {
	return Array.from({ length }, (_, i) => cb(i))
}
