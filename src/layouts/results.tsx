import { ImagesReceiver } from '@/components/images-receiver'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WorkFormProxy } from '@/config/proxies'
import { useSnapshot } from 'valtio'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export function Results() {
	const WorkFormProxySnap = useSnapshot(WorkFormProxy)
	return (
		<div className={'flex items-center justify-start w-full px-8 mt-8'}>
			<Card className={'w-full'}>
				<CardHeader>
					<CardTitle className='flex justify-between'>
						<div>
							<div>Check the results</div>
							<div></div>
						</div>
						<span className='text-muted-foreground text-base'>
							{WorkFormProxySnap.isIn !== undefined &&
								(WorkFormProxySnap.isIn ? (
									<Badge>Accepted ({WorkFormProxySnap.took} seconds)</Badge>
								) : (
									<Badge variant='destructive'>
										Rejected ({WorkFormProxySnap.took} seconds)
									</Badge>
								))}
						</span>
					</CardTitle>
					<CardDescription>
						<p className='mb-2'>Here you can find CNF & Parse Tree's</p>
						<p>
							{WorkFormProxySnap.sentence && (
								<Badge
									variant='secondary'
									className='mr-1 mb-2 md:mb-0'
								>
									Sentence: {WorkFormProxySnap.sentence}
								</Badge>
							)}
							{WorkFormProxySnap.initialSymbol && (
								<Badge
									variant='outline'
									className='mr-1'
								>
									Initial Symbol: {WorkFormProxySnap.initialSymbol}
								</Badge>
							)}
							{WorkFormProxySnap.prefix && (
								<Badge variant='outline'>
									Prefix: {WorkFormProxySnap.prefix}
								</Badge>
							)}
						</p>
					</CardDescription>
				</CardHeader>
				{WorkFormProxySnap.resultantGrammar && (
					<CardContent>
						<div className='grid md:grid-rows-3 md:grid-cols-3 md:grid-flow-col md:gap-4'>
							<div className='md:row-span-3 mb-6 md:mb-0 flex flex-col'>
								<label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									Original
								</label>
								<Textarea
									className='md:col-span-1 mt-2.5'
									rows={13}
									disabled
									value={WorkFormProxy.initialGrammar}
								/>
							</div>
							<div className='md:row-span-3 mb-6 md:mb-0 flex flex-col'>
								<label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									CNF
								</label>
								<Textarea
									className='md:col-span-1 mt-2.5'
									rows={13}
									disabled
									value={WorkFormProxy.resultantGrammar}
								/>
							</div>
							<div className='md:row-span-3 md:mt-6'>
								<ImagesReceiver />
							</div>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	)
}
