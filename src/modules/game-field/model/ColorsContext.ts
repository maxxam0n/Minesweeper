import { createContext } from 'react'
import { FieldColors } from './types'

export const ColorsContext = createContext<FieldColors | null>(null)
