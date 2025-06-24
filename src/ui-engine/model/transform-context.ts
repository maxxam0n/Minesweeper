import { createContext } from 'react'
import { Transform } from '../lib/types'

export const TransformContext = createContext<Transform[]>([])
