import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './pages/App.tsx'
import Docs from './pages/Docs.tsx'
import './index.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/docs',
		element: <Docs />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
