import * as React from 'react'
// import Link from 'next/link'

import { cn } from '@/lib/utils'
// import { Icons } from '@/components/icons'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const frontendRepo = 'grammar'
const backendRepo = 'grammar-server'

export function NavigationBar() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>About</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
							<li className='row-span-3'>
								<NavigationMenuLink asChild>
									<div className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md cursor-auto'>
										{/* <Icons.logo className="h-6 w-6" /> */}
										<div className='mb-2 mt-4 text-lg font-medium'>
											iGrammar
										</div>
										<p className='text-sm leading-tight text-muted-foreground'>
											Open Source project with grammar tools.
										</p>
									</div>
								</NavigationMenuLink>
							</li>
							<ListItem
								href={`https://github.com/chamale-rac/${frontendRepo}`}
								target='_blank'
								title={`${frontendRepo} (client)`}
							>
								UI and UX.
								<div className='flex flex-wrap gap-2 mt-1'>
									<img
										src={`https://img.shields.io/github/contributors/chamale-rac/${frontendRepo}.svg?maxAge=2592000`}
									/>
									<img
										src={`https://img.shields.io/github/issues/chamale-rac/${frontendRepo}.svg?maxAge=2592000`}
									/>
									{/* <img
										src={`https://img.shields.io/github/stars/chamale-rac/${frontendRepo}.svg?style=social&label=Star&maxAge=2592000`}
									/> */}
								</div>
							</ListItem>
							<ListItem
								href={`https://github.com/chamale-rac/${backendRepo}`}
								target='_blank'
								title={`${backendRepo} (server)`}
							>
								Algorithms and API.
								<div className='flex flex-wrap gap-2 mt-1'>
									<img
										src={`https://img.shields.io/github/contributors/chamale-rac/${backendRepo}.svg?maxAge=2592000`}
									/>
									<img
										src={`https://img.shields.io/github/issues/chamale-rac/${backendRepo}.svg?maxAge=2592000`}
									/>
									{/* <img
										src={`https://img.shields.io/github/stars/chamale-rac/${backendRepo}.svg?style=social&label=Star&maxAge=2592000`}
									/> */}
								</div>
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>{title}</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = 'ListItem'
