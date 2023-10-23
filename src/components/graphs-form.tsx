import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ExternalLink } from 'lucide-react'
import * as z from 'zod'
import { GraphsFormProxy, interactionProxy, saveProxy } from '@/config/proxies'
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

const formSchema = z.object({
	expression: z
		.string()
		.min(1, {
			message: 'Expression must be at least 1 characters.',
		})
		.max(100, {
			message: 'Expression must be at most 100 characters.',
		}),
})

interface Image {
	src: string
	alt: string
	width: number
	height: number
	title: string
	description: string
}

interface Table {
	title: string
	head: string[]
	body: string[][]
}

interface responseData {
	expression: string
	images: Image[]
	tables: Table[]
}

interface postData {
	expression: string
}

export function GraphsForm() {
	const interactionProxySnap = useSnapshot(interactionProxy)
	const saveProxySnap = useSnapshot(saveProxy)
	const { toast } = useToast()

	const postExpression = async (expression: string) => {
		try {
			const postData: postData = {
				expression: expression,
			}
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_BASE_URL}/graphs`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData),
				}
			)
			const responseData: responseData = await response.json()

			GraphsFormProxy.expression = responseData.expression
			GraphsFormProxy.images = responseData.images
			GraphsFormProxy.tables = responseData.tables
			toast({
				title: 'Graphs',
				description: 'Work done! Check the results.',
			})
		} catch (e) {
			toast({
				title: 'Graphs',
				description: 'Something went wrong.',
			})
			console.log(e)
		}
	}

	// Define form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			expression: saveProxySnap.graphExpressionInput,
		},
	})

	// Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		postExpression(values.expression)
		toast({
			title: 'Graphs',
			description: 'Working on your expression.',
		})
	}

	function onShare(values: z.infer<typeof formSchema>) {
		// Copy the actual url to clipboard, attaching a query param with the expression in a base64 format.
		const url = new URL(window.location.href)
		url.searchParams.set('tab', 'graphs')
		url.searchParams.set(
			'expression',
			btoa(encodeURIComponent(values.expression))
		)
		navigator.clipboard.writeText(url.toString())

		toast({
			title: 'Graphs',
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
		const tab = url.searchParams.get('tab')
		if (
			expression &&
			interactionProxySnap.firstTimeRetrieveURL &&
			tab === 'graphs'
		) {
			const decodedExpression = decodeURIComponent(atob(expression))
			postExpression(decodedExpression)
			form.setValue('expression', decodedExpression)
			interactionProxy.firstTimeRetrieveURL = false
			setTimeout(() => {
				toast({
					title: 'Graphs',
					description: 'Working on the retrieved expression.',
				})
			}, 10)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		saveProxy.graphExpressionInput = form.watch('expression')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('expression')])

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
				<div className='flex justify-between'>
					<Button type='submit'>Generate</Button>
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
