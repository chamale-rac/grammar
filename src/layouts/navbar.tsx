import { ModeToggle } from '@/components/mode-toggle'
import { NavigationBar } from '@/components/navigation-bar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'

export function NavBar() {
	return (
		<div
			className={
				'flex items-center justify-between w-full py-3 xl:px-56 md:px-4 border-b border-solid'
			}
		>
			<div className={'flex items-center justify-normal cursor-pointer'}>
				<Link to='/'>
					<Avatar className={'mx-3'}>
						<AvatarImage
							src='/1.svg'
							alt='iGrammar'
						/>
						<AvatarFallback>CR</AvatarFallback>
					</Avatar>
				</Link>
				<NavigationBar />
			</div>
			<ModeToggle />
		</div>
	)
}
