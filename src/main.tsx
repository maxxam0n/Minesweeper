import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'

const domRoot = document.getElementById('root')
if (!domRoot) {
	throw new Error('Root element not found')
}

ReactDOM.createRoot(domRoot).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
