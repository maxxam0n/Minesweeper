import { createContext } from 'react'
import { FieldConfig } from './types'

export const FieldPropsContext = createContext<FieldConfig | null>(null)
