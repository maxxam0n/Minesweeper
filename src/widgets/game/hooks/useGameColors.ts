import { useAppColors } from '@/providers/ColorsProvider'
import { FieldColors, FieldColorsEnum } from '@/modules/game-field'

export const useGameColors = (): FieldColors => {
	const appColors = useAppColors()

	const fieldColors: FieldColors = {
		[FieldColorsEnum.CLOSED]: appColors.CLOSED,
		[FieldColorsEnum.REVEALED]: appColors.REVEALED,
		[FieldColorsEnum.BORDER]: appColors.BORDER,
		[FieldColorsEnum.EXPLODED]: appColors.EXPLODED,
		[FieldColorsEnum.EXPLODED_BORDER]: appColors.EXPLODED_BORDER,
		[FieldColorsEnum.MISSED]: appColors.MISSED,
		[FieldColorsEnum.LIGHT_BEVEL]: appColors.LIGHT_BEVEL,
		[FieldColorsEnum.DARK_BEVEL]: appColors.DARK_BEVEL,
		[FieldColorsEnum.MINE]: appColors.MINE,
		[FieldColorsEnum.FLAG]: appColors.FLAG,
		[FieldColorsEnum.FLAG_SHAFT]: appColors.FLAG_SHAFT,
		[FieldColorsEnum.NUMBER_1]: appColors[1],
		[FieldColorsEnum.NUMBER_2]: appColors[2],
		[FieldColorsEnum.NUMBER_3]: appColors[3],
		[FieldColorsEnum.NUMBER_4]: appColors[4],
		[FieldColorsEnum.NUMBER_5]: appColors[5],
		[FieldColorsEnum.NUMBER_6]: appColors[6],
		[FieldColorsEnum.NUMBER_7]: appColors[7],
		[FieldColorsEnum.NUMBER_8]: appColors[8],
	}

	return fieldColors
}
