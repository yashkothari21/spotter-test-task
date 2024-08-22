import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { FC, useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import { compareDates } from '../util/table'
import DataTableToolbar from './DataTableToolbar'
import TableSkeleton from './TableSkeleton'
import { Box } from '@mui/material'
import DataTableChart from './TableChart'

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
				<DataTableToolbar
					table={table}
					setShowSearch={setShowSearch}
					showSearch={showSearch}
				/>
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

	const dataTableChartData = useMemo(() => {
		return table.getFilteredRowModel().rows.map((item) => item.original)
	}, [table.getFilteredRowModel().rows])

	return loading ? (
		<TableSkeleton />
	) : (
		<>
			<MaterialReactTable table={table} />

			{parsedData.length > 0 && (
				<Box sx={{ mt: 2 }}>
					<DataTableChart chartData={dataTableChartData} />
				</Box>
			)}
		</>
	)
}

export default TableView
