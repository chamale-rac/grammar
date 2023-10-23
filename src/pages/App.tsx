import { ThemeProvider } from '@/components/theme-provider'
import { Results } from '@/layouts/results'
import { NavBar } from '@/layouts/navbar'
import { CardWithForm } from '../components/card-with-form'
import { Toaster } from '@/components/ui/toaster'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Help } from '@/layouts/help'
import { WorkForm } from '@/components/work-form'

function App() {
	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'
		>
			<NavBar />
			<Tabs
				defaultValue={'work'}
				className='w-full flex flex-col mb-8'
			>
				<TabsList className='grid xl:w-[800px] grid-cols-2 mx-8 mt-8 self-center'>
					<TabsTrigger value='work'>Work</TabsTrigger>
					<TabsTrigger value='help'>Help</TabsTrigger>
				</TabsList>
				<TabsContent value='work'>
					<CardWithForm
						title='Define a grammar'
						description='To CNF and apply CYK in one click.'
					>
						<WorkForm />
					</CardWithForm>
					<Results />
				</TabsContent>
				<TabsContent value='help'>
					<Help />
				</TabsContent>
			</Tabs>
			<Toaster />
		</ThemeProvider>
	)
}

export default App
