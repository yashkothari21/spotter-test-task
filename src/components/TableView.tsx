import {
	MaterialReactTable,
	MRT_TableInstance,
	useMaterialReactTable,
} from 'material-react-table'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DateTime } from 'luxon'

import { compareDates } from '../util/table'
import DataTableToolbar from './DataTableToolbar'
import TableSkeleton from './TableSkeleton'
import { Box } from '@mui/material'
import DataTableChart from './TableChart'
import PivotChart from './PivotChart'
import ResetModal from './RestModal'

interface TableViewProps {
	tableData: {
		loading: boolean
		parsedData: any[]
		columns: any[]
	}
	isPivot: boolean
}

const TableView: FC<TableViewProps> = ({
	tableData: { loading, parsedData, columns },
	isPivot,
}) => {
	const [filters, setFilters] = useState(
		JSON.parse(localStorage.getItem('filters') || '[]')
	)
	const [showSearch, setShowSearch] = useState<boolean>(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [rowGrouping, setRowGrouping] = useState<null | string>('Month')
	const [openResetModal, setOpenResetModal] = useState(false)
	const isFirstRender = useRef(true)

	const tableColumns = useMemo(() => {
		return [
			...columns,
			{ headerName: 'Month', field: 'groupMonth' },
			{ headerName: 'Year', field: 'groupYear' },
			{ headerName: 'Week', field: 'groupWeek' },
		].map((col) => {
			const isDateField = ['created_dt', 'data_source_modified_dt'].includes(
				col.field
			)

			return {
				...col,
				header: col.headerName,
				enableColumnOrdering: true,
				accessorKey: col.field,
				muiEditTextFieldProps: () => ({
					type: isDateField ? 'date' : 'text',
					...(isDateField && {
						sortingFn: (r1: any, r2: any, id: any) =>
							compareDates(r1.getValue(id), r2.getValue(id)),
					}),
				}),
			}
		})
	}, [loading])

	const tableRows = useMemo(() => {
		return parsedData.map((dataRow: any) => {
			const createdDate = DateTime.fromJSDate(new Date(dataRow.created_dt))
			const modifiedDate = DateTime.fromJSDate(
				new Date(dataRow.data_source_modified_dt)
			)

			return {
				...dataRow,
				created_dt: createdDate.toFormat('dd LLL, yyyy hh:MM a'),
				groupMonth: createdDate.toFormat('LLLL'),
				groupYear: createdDate.toFormat('yyyy'),
				groupWeek: `Week ${createdDate.toFormat('W')} (${createdDate
					.startOf('week')
					.toFormat('d MMM, yyyy')} - ${createdDate
					.endOf('week')
					.toFormat('d MMM, yyyy')})`,
				data_source_modified_dt: modifiedDate.toFormat('dd LLL, yyyy hh:MM a'),
			}
		})
	}, [loading])

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
					isPivot={isPivot}
					showSearch={showSearch}
					setShowSearch={setShowSearch}
					setOpenResetModal={setOpenResetModal}
					anchorEl={anchorEl}
					handleClick={handleClick}
					handleClose={handleClose}
					handleGrouping={handleGrouping}
					rowGrouping={rowGrouping}
					setRowGrouping={setRowGrouping}
				/>
			)
		},
		onColumnFiltersChange: setFilters,
		initialState: {
			columnVisibility: {
				groupMonth: isPivot,
				groupYear: false,
				groupWeek: false,
			},
			showColumnFilters: filters.length ? true : false,
			grouping: ['groupMonth'],
			columnFilters: filters,
		},
		enableColumnResizing: true,
		enableColumnOrdering: true,
		enableColumnDragging: !isPivot,
		enableColumnFilters: !isPivot,
		editDisplayMode: 'cell',
		enableCellActions: !isPivot,
		enableEditing: !isPivot,
		state: {
			showGlobalFilter: !isPivot,
			density: 'compact',
			columnFilters: filters,
			isLoading: loading,
		},
		autoResetAll: true,
		paginationDisplayMode: 'default',
		enableGrouping: isPivot,
		enableGlobalFilter: !isPivot,
		enableFullScreenToggle: false,
		enableDensityToggle: false,
	})

	const dataTableChartData = useMemo(() => {
		return table.getFilteredRowModel().rows.map((item) => item.original)
	}, [table.getFilteredRowModel().rows])

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleGrouping = (table: MRT_TableInstance<any>, group: string) => {
		const visibility = {
			groupMonth: false,
			groupYear: false,
			groupWeek: false,
		}

		switch (group) {
			case 'Month':
				table.setGrouping(['groupMonth'])
				setRowGrouping('Month')
				visibility.groupMonth = isPivot
				break
			case 'Year':
				table.setGrouping(['groupYear'])
				setRowGrouping('Year')
				visibility.groupYear = isPivot
				break
			case 'Week':
				table.setGrouping(['groupWeek'])
				setRowGrouping('Week')
				visibility.groupWeek = isPivot
				break
			default:
				table.setGrouping([])
				setRowGrouping('')
				visibility.groupMonth = isPivot
		}

		table.setColumnVisibility(visibility)
		handleClose()
	}

	const handleSave = useCallback(() => {
		const columnFilters = table.getState().columnFilters || []
		localStorage.setItem('filters', JSON.stringify(columnFilters))
		setFilters(columnFilters)
	}, [table.getFilteredRowModel().rows])

	useEffect(() => {
		const params = new URLSearchParams()

		filters.forEach((filter) => {
			params.append(filter.id, filter.value)
		})

		const url = new URL(window.location.href)
		const tableFiltersFromURL = Array.from(url.searchParams.entries())
			.filter(([_, value]) => value)
			.map(([key, value]) => ({ id: key, value }))

		if (isFirstRender.current) {
			if (tableFiltersFromURL.length > 0) {
				setFilters(tableFiltersFromURL)
			}
			isFirstRender.current = false
			return
		}

		const newUrl = `${window.location.pathname.replace(
			/\/$/,
			''
		)}?${params.toString()}`
		window.history.pushState({}, '', newUrl)
		handleSave()
	}, [filters])

	return loading ? (
		<>
			<h1>{loading}</h1>
			<TableSkeleton />
		</>
	) : (
		<>
			<MaterialReactTable table={table} />

			{openResetModal && (
				<ResetModal
					open={openResetModal}
					handleClose={() => setOpenResetModal(false)}
					handleSuccess={() => {
						setOpenResetModal(false)
						localStorage.removeItem('filters')
						setFilters([])
					}}
				/>
			)}

			{parsedData.length > 0 && (
				<Box sx={{ mt: 2 }}>
					{isPivot ? (
						<PivotChart grouping={rowGrouping} tableData={tableRows} />
					) : (
						<DataTableChart chartData={dataTableChartData} />
					)}
				</Box>
			)}
		</>
	)
}

export default TableView
