import { FC } from 'react'
import { Box, Button, IconButton, Menu, MenuItem, Stack } from '@mui/material'
import { Cancel, Search, Share } from '@mui/icons-material'
import {
	MRT_GlobalFilterTextField,
	MRT_ToggleFiltersButton,
	MRT_TableInstance,
} from 'material-react-table'

interface TableToolbarProps {
	table: MRT_TableInstance<any>
	isPivot: boolean
	showSearch: boolean
	setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
	setOpenResetModal: React.Dispatch<React.SetStateAction<boolean>>
	anchorEl: null | HTMLElement
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
	handleClose: () => void
	handleGrouping: (table: MRT_TableInstance<any>, group: string) => void
	rowGrouping: string | null
	setRowGrouping: React.Dispatch<React.SetStateAction<string | null>>
}

const TableToolbar: FC<TableToolbarProps> = ({
	table,
	isPivot,
	showSearch,
	setShowSearch,
	setOpenResetModal,
	anchorEl,
	handleClick,
	handleClose,
	handleGrouping,
	rowGrouping,
}) => (
	<Box
		sx={{
			display: 'flex',
			gap: '0.5rem',
			p: '8px',
			justifyContent: 'space-between',
			borderBottom: '0.5px solid lightgray',
		}}
	>
		{!isPivot && (
			<Stack direction='row'>
				{showSearch && <MRT_GlobalFilterTextField table={table} />}
				<IconButton onClick={() => setShowSearch((prev) => !prev)}>
					{showSearch ? <Cancel /> : <Search />}
				</IconButton>
			</Stack>
		)}

		<Box sx={{ display: 'flex', gap: '0.5rem', ml: 'auto' }}>
			{!isPivot && <MRT_ToggleFiltersButton table={table} />}
			<Button
				aria-controls='date-reset-btn'
				aria-haspopup='true'
				onClick={() => setOpenResetModal(true)}
				variant='contained'
				sx={{ textTransform: 'unset' }}
			>
				Reset
			</Button>

			{isPivot && (
				<>
					<Button
						aria-controls='date-groupby-menu'
						aria-haspopup='true'
						onClick={handleClick}
						variant='contained'
						sx={{ textTransform: 'unset' }}
					>
						Group By
					</Button>
					<Menu
						id='date-groupby-menu'
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						{['Week', 'Month', 'Year'].map((key) => (
							<MenuItem
								key={key}
								selected={key === rowGrouping}
								onClick={() => handleGrouping(table, key)}
								sx={{
									'&.Mui-selected': {
										bgcolor: '#4f565d',
										color: 'white',
									},
								}}
							>
								{key}
							</MenuItem>
						))}
					</Menu>
				</>
			)}
			<Button
				aria-controls='date-share-btn'
				aria-haspopup='true'
				onClick={() => {
					const currentUrl = window.location.href
					navigator.clipboard
						.writeText(currentUrl)
						.then(() => {
							alert('URL copied to clipboard!')
						})
						.catch((err) => {
							console.error('Failed to copy URL: ', err)
						})
				}}
				variant='contained'
				sx={{ textTransform: 'unset' }}
			>
				<Share />
			</Button>
		</Box>
	</Box>
)

export default TableToolbar
