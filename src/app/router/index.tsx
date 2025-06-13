import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/views/home-view'
import { GameView } from '@/views/game-view'
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
				Component: GameView,
			},
		],
	},
])
