import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ExternalLink } from 'lucide-react'
import * as z from 'zod'
import {
	SimulateFormProxy,
	interactionProxy,
	saveProxy,
} from '@/config/proxies'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useSnapshot } from 'valtio'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
	expression: z
		.string()
		.min(1, {
			message: 'Expression must be at least 1 characters.',
		})
		.max(100, {
			message: 'Expression must be at most 100 characters.',
		}),
	strings: z.string().min(1, {
		message: 'Strings must be at least 1 characters.',
	}),
})

interface Table {
	title: string
	head: string[]
	body: string[][]
}

interface responseData {
	expression: string
	tables: Table[]
}

interface postData {
	expression: string
	strings: string[]
}

export function SimulateForm() {
	const interactionProxySnap = useSnapshot(interactionProxy)
	const saveProxySnap = useSnapshot(saveProxy)
	const { toast } = useToast()

	const postExpression = async (expression: string, strings: string[]) => {
		try {
			const postData: postData = {
				expression: expression,
				strings: strings,
			}
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_BASE_URL}/simulation`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData),
				}
			)
			const responseData: responseData = await response.json()

			SimulateFormProxy.expression = responseData.expression
			SimulateFormProxy.tables = responseData.tables
			console.log(responseData)
			toast({
				title: 'Simulation',
				description: 'Work done! Check the results.',
			})
		} catch (e) {
			toast({ title: 'Simulation', description: 'Something went wrong.' })
			console.log(e)
		}
	}

	// Define form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			expression: saveProxySnap.simulateExpressionInput,
			strings: saveProxySnap.simulateStringsInput,
		},
	})

	// Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		const splitByNewLine = values.strings.split('\n')
		postExpression(values.expression, splitByNewLine)
		toast({
			title: 'Simulation',
			description: 'Working on your expression.',
		})
	}

	function onShare(values: z.infer<typeof formSchema>) {
		// Copy the actual url to clipboard, attaching a query param with the expression in a base64 format.
		const url = new URL(window.location.href)
		url.searchParams.set('tab', 'simulation')
		url.searchParams.set(
			'expression',
			btoa(encodeURIComponent(values.expression))
		)
		url.searchParams.set('strings', btoa(encodeURIComponent(values.strings)))
		navigator.clipboard.writeText(url.toString())

		toast({
			title: 'Simulation',
			description: 'URL copied to clipboard.',
			action: (
				<ToastAction
					altText='Goto copied url'
					// onClick redirect to copied url
					onClick={() => {
						window.open(url.toString(), '_blank')
					}}
				>
					<ExternalLink
						className='relative top-[1px] h-4 w-3 transition duration-200'
						aria-hidden='true'
					/>
				</ToastAction>
			),
		})
	}

	useEffect(() => {
		const url = new URL(window.location.href)

		const expression = url.searchParams.get('expression')
		const strings = url.searchParams.get('strings')

		const tab = url.searchParams.get('tab')
		if (
			strings &&
			expression &&
			interactionProxySnap.firstTimeRetrieveURL &&
			tab === 'simulation'
		) {
			const decodedExpression = decodeURIComponent(atob(expression))
			const decodedStrings = decodeURIComponent(atob(strings))

			postExpression(decodedExpression, decodedStrings.split('\n'))
			form.setValue('expression', decodedExpression)
			form.setValue('strings', decodedStrings)
			interactionProxy.firstTimeRetrieveURL = false
			setTimeout(() => {
				toast({
					title: 'Simulation',
					description: 'Working on the retrieved expression.',
				})
			}, 10)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		saveProxy.simulateExpressionInput = form.watch('expression')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('expression')])

	useEffect(() => {
		saveProxy.simulateStringsInput = form.watch('strings')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('strings')])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'
			>
				<FormField
					control={form.control}
					name='expression'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expression</FormLabel>
							<FormControl>
								<Input
									placeholder='Your expression'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This will be the evaluated expression. Use ϵ
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='strings'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Strings</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Type your test string here.'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Each string must be separated by a new line (enter).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex justify-between'>
					<Button type='submit'>Simulate</Button>
					<Button
						variant='outline'
						type='button'
						onClick={form.handleSubmit(onShare)}
					>
						Share
					</Button>
				</div>
			</form>
		</Form>
	)
}
