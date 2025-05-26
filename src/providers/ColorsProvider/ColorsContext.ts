import { createContext } from 'react'
import { FieldColorsEnum } from '@/modules/game-field'

export enum AppColorsEnum {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY',
	LIGHT = 'LIGHT',
	LIGHT_LIGHT = 'LIGHT_LIGHT',
	DARK = 'DARK',
	DARK_DARK = 'DARK_DARK',
	GREY_MAIN = 'GREY_MAIN',
	GREY_LIGHT = 'GREY_LIGHT',
	GREY_MIDDLE = 'GREY_MIDDLE',
	GREY_DARK = 'GREY_DARK',
}

export const ColorsContext = createContext<Record<
	AppColorsEnum | FieldColorsEnum,
	string
> | null>(null)
