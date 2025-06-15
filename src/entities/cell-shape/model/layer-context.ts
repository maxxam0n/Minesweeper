import { createContext } from 'react'
import { Layer } from '@/shared/canvas'

export const LayerContext = createContext<Layer>('dynamic')
