import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { PropsWithChildren, useState } from 'react'
import { useTabContext } from '../context/tab'

const drawerWidth = 240
const navItems = [
	{ lable: 'Data Table', key: 'data-table' },
	{ lable: 'Pivot Table', key: 'pivot-table' },
]

const PageLayout = ({ children }: PropsWithChildren) => {
	const { currentTab, changeTab } = useTabContext()
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState)
	}

	const container = () => window.document.body

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography variant='h6' sx={{ my: 2 }}>
				TABLES
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item.key} disablePadding>
						<ListItemButton sx={{ textAlign: 'center' }}>
							<ListItemText primary={item.lable} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar component='nav'>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
					>
						TABLES
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button
								key={item.key}
								sx={{
									color: currentTab === item.key ? 'gray' : 'white',
									backgroundColor:
										currentTab === item.key ? 'white' : 'transparent',
									marginLeft: 2,
									fontWeight: currentTab === item.key ? 'bold' : 'normal',
									outline: 'none',
								}}
								onClick={() => changeTab(item.key)}
							>
								{item.lable}
							</Button>
						))}
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					container={container}
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</nav>
			<Box component='main' sx={{ width: '100vw', boxSizing: 'border-box' }}>
				<Box sx={{ p: 3, marginTop: 10 }}>{children}</Box>
			</Box>
		</Box>
	)
}

export default PageLayout
