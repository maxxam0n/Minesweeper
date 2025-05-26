import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { GamePage } from '@/pages/GamePage/GamePage'
import { Root } from '../Root'

export const router = createBrowserRouter([
	{
		path: '/',
		Component: Root,
		children: [
			{
				path: '/',
				Component: HomePage,
				index: true,
			},
			{
				path: '/game',
				Component: GamePage,
			},
		],
	},
])
