import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TableCustom } from '@/components/table-custom'

interface Table {
	title: string
	head: string[]
	body: string[][]
}

export function Tables({
	tables,
	using,
	title,
	description,
}: {
	tables?: Table[]
	using?: string
	title?: string
	description?: string
}) {
	return (
		<div className={'flex items-center justify-start w-full px-8 mt-8'}>
			<Card className={'w-full'}>
				<CardHeader>
					<CardTitle className='flex justify-between'>
						{title}
						<span className='text-muted-foreground text-base'>
							{'Using: '}
							{using}
						</span>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				{tables?.map((table) => (
					<CardContent>
						<TableCustom
							title={table.title}
							head={table.head}
							body={table.body}
						/>
					</CardContent>
				))}
			</Card>
		</div>
	)
}
