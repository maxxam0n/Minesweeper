export const parseToNumber = (num: unknown) => {
	const anyAsNumber = Number(num)
	if (!isNaN(anyAsNumber)) return anyAsNumber
	else return 0
}
