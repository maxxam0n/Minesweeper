export type GameSettings = {
	colors: GameColors
	cell: {
		size: number
		font: string
		bevelWidth: number
		borderWidth: number
	}
	animations: {
		enabled: boolean
		duration: number
	}
}

export const GAME_COLORS = {
	closed: 'closed',
	revealed: 'revealed',
	border: 'border',
	exploded: 'exploded',
	explodedBorder: 'explodedBorder',
	missed: 'missed',
	lightBevel: 'lightBevel',
	darkBevel: 'darkBevel',
	mine: 'mine',
	flag: 'flag',
	flagShaft: 'flagShaft',
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
	6: '6',
	7: '7',
	8: '8',
} as const

export type GameColors = Record<keyof typeof GAME_COLORS, string>
