import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export function CardWithForm({
	children,
	title,
	description,
}: {
	children?: React.ReactNode
	title?: string
	description?: string
}) {
	return (
		<div className={'flex items-center justify-start w-full px-8 mt-8'}>
			<Card className='w-[350px] sm:w-full'>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</div>
	)
}
