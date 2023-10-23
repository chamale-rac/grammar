import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

const grammar = [
	{
		id: 1,
		token: 'Non-terminal (Initial Symbol, Prefix...)',
		example: 'AB, A, A1, 1A...',
		notes:
			'Must be an uppercase letter if length is 1, otherwise it can be uppercase letters and numbers.',
	},
	{
		id: 2,
		token: 'Terminal',
		example: '[a-z], [0-9]...',
		notes: 'Any word in lowercase, and individual numbers are valid too.',
	},
]

export function Help() {
	return (
		<div className={'flex items-center justify-start w-full px-8 mt-8'}>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Are you lost?</CardTitle>
					<CardDescription>
						Learn what it does and how to use it!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion
						type='single'
						collapsible
						className='w-full'
					>
						<AccordionItem value='item-1'>
							<AccordionTrigger>Introduction</AccordionTrigger>
							<AccordionContent>
								iGrammar is a powerful web tool designed to enhance your
								understanding of grammars. Originally developed as part of a
								class project for the esteemed course at Universidad del Valle
								de Guatemala. With iGrammar, you can effortlessly transform to
								CNF and apply CYK in one click. Thanks for using, and enjoy!
								<br />
								<br />
								Sincerely, Samuel A. Chamalé - Human
								<br />
								Guatemala, 2023
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-2'>
							<AccordionTrigger>Supported grammars</AccordionTrigger>
							<AccordionContent>
								Each row need to have a non-terminal then a{' '}
								<strong>{'->'}</strong> and finally the desired productions.
								Each production have different rules, and each rule different
								terminal or non-terminal. It needs to be separated by a{' '}
								<strong>{'|'}</strong> and tokens by a space.{' '}
								<a
									className='text-blue-500'
									href='https://github.com/chamale-rac/grammar-server/tree/main/docs'
									target='_blank'
								>
									Here some examples
								</a>
								.
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='w-[300px]'>Type</TableHead>
											<TableHead>Example</TableHead>
											<TableHead>Notes</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{grammar.map((rule) => (
											<TableRow key={rule.id}>
												<TableCell className='font-medium'>
													{rule.token}
												</TableCell>
												<TableCell>{rule.example}</TableCell>
												<TableCell>{rule.notes}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-3'>
							<AccordionTrigger>Tips</AccordionTrigger>
							<AccordionContent>
								<ol>
									<li>
										<strong>1. </strong>Click an image, then there is a download
										button on the top right corner.
									</li>
									<li>
										<strong>2. </strong>When sharing a graph, you can go to the
										page by clicking the icon on the toast.
									</li>
								</ol>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>
		</div>
	)
}
