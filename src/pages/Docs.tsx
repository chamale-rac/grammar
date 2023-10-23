import { ThemeProvider } from '@/components/theme-provider'
import { NavBar } from '@/layouts/navbar'

function Docs() {
	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'
		>
			<NavBar />
			<div>Pending to write...</div>
		</ThemeProvider>
	)
}

export default Docs
