import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ExternalLink } from 'lucide-react'
import * as z from 'zod'
import { interactionProxy, neoSaveProxy, WorkFormProxy } from '@/config/proxies'
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
	grammar: z.string().min(5, {
		message: 'Grammar must be at least 5 characters.',
	}),
	initialSymbol: z.string().refine(
		(value) => {
			if (value.length === 1) {
				// needs to be a letter uppercase
				return value === value.toUpperCase() && /[A-Z]/.test(value)
			} else {
				return /^[A-Z0-9]*$/.test(value)
			}
		},
		{
			message:
				'Initial symbol must be an uppercase letter if length is 1, otherwise it can be uppercase letters and numbers.',
		}
	),
	prefix: z.string().refine(
		(value) => {
			if (value.length === 1) {
				// needs to be a letter uppercase
				return value === value.toUpperCase() && /[A-Z]/.test(value)
			} else {
				return /^[A-Z0-9]*$/.test(value)
			}
		},
		{
			message:
				'Initial symbol must be an uppercase letter if length is 1, otherwise it can be uppercase letters and numbers.',
		}
	),
	sentence: z
		.string()
		.min(1, {
			message: 'Sentence must be at least 1 characters.',
		})
		.refine(
			(value) => {
				// just lowercase
				return value === value.toLowerCase()
			},
			{
				message: 'Sentence must be lowercase.',
			}
		),
})

interface Image {
	src: string
	alt: string
	width: number
	height: number
	title: string
	description: string
}

interface responseData {
	prefix: string
	initialSymbol: string
	resultantGrammar: string
	initialGrammar: string
	sentence: string
	images: Image[]
	isIn: boolean
}

interface postData {
	grammar: string[]
	initialSymbol: string
	prefix: string
	sentence: string
}

export function WorkForm() {
	const interactionProxySnap = useSnapshot(interactionProxy)
	const neoSaveProxySnap = useSnapshot(neoSaveProxy)
	const { toast } = useToast()

	const postGrammar = async (
		grammar: string[],
		initialSymbol: string,
		prefix: string,
		sentence: string
	) => {
		try {
			const postData: postData = {
				grammar,
				initialSymbol,
				prefix,
				sentence,
			}
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_BASE_URL}/cyk`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData),
				}
			)
			const responseData: responseData = await response.json()

			WorkFormProxy.prefix = responseData.prefix
			WorkFormProxy.initialSymbol = responseData.initialSymbol
			WorkFormProxy.resultantGrammar = responseData.resultantGrammar
			WorkFormProxy.initialGrammar = responseData.initialGrammar
			WorkFormProxy.sentence = responseData.sentence
			WorkFormProxy.images = responseData.images
			WorkFormProxy.isIn = responseData.isIn

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
			grammar: neoSaveProxySnap.grammar,
			initialSymbol: neoSaveProxySnap.initialSymbol,
			prefix: neoSaveProxySnap.prefix,
			sentence: neoSaveProxySnap.sentence,
		},
	})

	// Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		const splitByNewLine = values.grammar.split('\n')
		postGrammar(
			splitByNewLine,
			values.initialSymbol,
			values.prefix,
			values.sentence
		)
		toast({
			title: 'Simulation',
			description: 'Working on your expression.',
		})
	}

	function onShare(values: z.infer<typeof formSchema>) {
		// Copy the actual url to clipboard, attaching a query param with the expression in a base64 format.
		const url = new URL(window.location.href)
		url.searchParams.set('grammar', btoa(encodeURIComponent(values.grammar)))
		url.searchParams.set(
			'initialSymbol',
			btoa(encodeURIComponent(values.initialSymbol))
		)
		url.searchParams.set('prefix', btoa(encodeURIComponent(values.prefix)))
		url.searchParams.set('sentence', btoa(encodeURIComponent(values.sentence)))
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

		const grammar = url.searchParams.get('grammar')
		const initialSymbol = url.searchParams.get('initialSymbol')
		const prefix = url.searchParams.get('prefix')
		const sentence = url.searchParams.get('sentence')

		if (
			grammar &&
			initialSymbol &&
			prefix &&
			sentence &&
			interactionProxySnap.firstTimeRetrieveURL
		) {
			const decodedGrammar = decodeURIComponent(atob(grammar))
			const decodedInitialSymbol = decodeURIComponent(atob(initialSymbol))
			const decodedPrefix = decodeURIComponent(atob(prefix))
			const decodedSentence = decodeURIComponent(atob(sentence))

			postGrammar(
				decodedGrammar.split('\n'),
				decodedInitialSymbol,
				decodedPrefix,
				decodedSentence
			)

			form.setValue('grammar', decodedGrammar)
			form.setValue('initialSymbol', decodedInitialSymbol)
			form.setValue('prefix', decodedPrefix)
			form.setValue('sentence', decodedSentence)
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
		neoSaveProxy.grammar = form.watch('grammar')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('grammar')])

	useEffect(() => {
		neoSaveProxy.initialSymbol = form.watch('initialSymbol')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('initialSymbol')])

	useEffect(() => {
		neoSaveProxy.prefix = form.watch('prefix')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('prefix')])

	useEffect(() => {
		neoSaveProxy.sentence = form.watch('sentence')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch('sentence')])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'
			>
				<div className='grid md:grid-rows-3 md:grid-flow-col md:gap-4'>
					<div className='md:row-span-3'>
						<FormField
							control={form.control}
							name='grammar'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grammar</FormLabel>
									<FormControl>
										<Textarea
											rows={13}
											placeholder='Type your grammar here.'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Each line is a production. Use ϵ
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name='initialSymbol'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Initial Symbol</FormLabel>
								<FormControl>
									<Input
										placeholder='Your initial symbol'
										{...field}
									/>
								</FormControl>
								<FormDescription>
									The initial symbol of the grammar.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='prefix'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prefix</FormLabel>
								<FormControl>
									<Input
										placeholder='The prefix desired'
										{...field}
									/>
								</FormControl>
								<FormDescription>Prefix for new non-terminals.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='sentence'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sentence</FormLabel>
								<FormControl>
									<Input
										placeholder='Your expression'
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This will be the evaluated sentence using CYK
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex justify-between'>
					<Button type='submit'>Send</Button>
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
