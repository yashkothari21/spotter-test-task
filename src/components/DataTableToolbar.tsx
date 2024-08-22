import { Cancel, Search } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import {
	MRT_GlobalFilterTextField,
	MRT_ToggleFiltersButton,
} from 'material-react-table'
import { FC } from 'react'

interface Props {
	showSearch: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: any
	setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const DataTableToolbar: FC<Props> = ({ showSearch, table, setShowSearch }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				gap: '0.5rem',
				p: '8px',
				justifyContent: 'space-between',
				borderBottom: '0.5px solid lightgray',
			}}
		>
			<Stack direction='row'>
				{showSearch && <MRT_GlobalFilterTextField table={table} />}
				<IconButton onClick={() => setShowSearch((prev) => !prev)}>
					{showSearch ? <Cancel /> : <Search />}
				</IconButton>
			</Stack>
			<MRT_ToggleFiltersButton table={table} />
		</Box>
	)
}

export default DataTableToolbar
