import {
	MaterialReactTable,
	MRT_GlobalFilterTextField,
	MRT_ToggleFiltersButton,
	useMaterialReactTable,
} from 'material-react-table'
import { FC, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Box, IconButton, Skeleton, Stack } from '@mui/material'
import { compareDates } from '../util/table'
import { Cancel, Search } from '@mui/icons-material'

interface TableViewProps {
	tableData: {
		loading: boolean
		parsedData: any[]
		columns: any[]
	}
}

const TableView: FC<TableViewProps> = ({
	tableData: { loading, parsedData, columns },
}) => {
	const [filters, setFilters] = useState(
		JSON.parse(localStorage.getItem('filters') || '[]')
	)
	const [showSearch, setShowSearch] = useState<boolean>(false)

	const tableColumns = useMemo(
		() =>
			[...columns].map((col) => ({
				...col,
				header: col.headerName,
				enableColumnOrdering: true,
				accessorKey: col.field,
				muiEditTextFieldProps: () => ({
					type: ['created_dt', 'data_source_modified_dt'].includes(col.field)
						? 'date'
						: 'text',
					...(['created_dt', 'data_source_modified_dt'].includes(col.field) && {
						sortingFn: (r1: any, r2: any, id: any) => {
							return compareDates(r1.getValue(id), r2.getValue(id))
						},
					}),
				}),
			})),
		[columns]
	)

	const tableRows = useMemo(
		() =>
			parsedData.map((dataItem: any) => ({
				...dataItem,
				created_dt: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
					'dd LLL, yyyy hh:MM a'
				),
				dateMonth: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
					'LLLL'
				),
				dateYear: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
					'yyyy'
				),
				dateWeek:
					'Week ' +
					DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(`W`) +
					` (${DateTime.fromJSDate(new Date(dataItem.created_dt))
						.startOf('week')
						.toFormat('d MMM, yyyy')} - ${DateTime.fromJSDate(
						new Date(dataItem.created_dt)
					)
						.endOf('week')
						.toFormat('d MMM, yyyy')})`,
				data_source_modified_dt: DateTime.fromJSDate(
					new Date(dataItem.data_source_modified_dt)
				).toFormat('dd LLL, yyyy hh:MM a'),
			})),
		[parsedData.length]
	)

	const table = useMaterialReactTable({
		columns: tableColumns,
		data: tableRows,
		muiTableBodyRowProps: ({ row }) => ({
			sx: {
				fontSize: 10,
				backgroundColor: row.index % 2 === 0 ? 'white' : '#e5e5e5',
			},
		}),
		muiTableContainerProps: { sx: { height: '80%' } },
		muiPaginationProps: {
			shape: 'rounded',
			variant: 'outlined',
			color: 'primary',
			size: 'small',
		},
		renderTopToolbar: () => {
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
		},
		onColumnFiltersChange: setFilters,
		initialState: {
			columnVisibility: {
				dateMonth: false,
				dateYear: false,
				dateWeek: false,
			},
			showColumnFilters: filters.length ? true : false,
			grouping: ['dateMonth'],
			columnFilters: filters,
		},
		paginationDisplayMode: 'default',
		enableGrouping: false,
		enableDensityToggle: false,
		enableFullScreenToggle: false,
		enableGlobalFilter: true,
		// Columns
		enableColumnResizing: true,
		enableColumnDragging: true,
		enableColumnOrdering: true,
		enableColumnFilters: true,
		state: {
			showGlobalFilter: true,
			density: 'compact',
			columnFilters: filters,
			isLoading: loading,
		},
		autoResetAll: true,
	})

	return loading ? (
		<>
			<Box sx={{ width: '50%', textAlign: 'center', margin: '0 auto' }}>
				<Skeleton sx={{ bgcolor: '#ffffff1a' }} />
				<Skeleton animation='wave' sx={{ bgcolor: '#ffffff36' }} />
				<Skeleton animation={false} sx={{ bgcolor: '#ffffff7a' }} />
			</Box>
		</>
	) : (
		<MaterialReactTable table={table} />
	)
}

export default TableView
