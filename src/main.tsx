import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'

const domRoot = document.getElementById('root')
if (!domRoot) {
	throw new Error('Root element not found')
}

const USE_STRICT = false

ReactDOM.createRoot(domRoot).render(
	USE_STRICT ? (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	) : (
		<RouterProvider router={router} />
	)
)
