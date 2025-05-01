import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './providers/ThemeProvider.tsx'
import { App } from './app/App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</React.StrictMode>
)
