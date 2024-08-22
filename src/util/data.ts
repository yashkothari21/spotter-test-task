// src/data.ts

import Papa from 'papaparse'
import { useState, useEffect } from 'react'

export interface CarrierData {
	created_dt: string
	data_source_modified_dt: string
	entity_type: string
	operating_status: string
	legal_name: string
	dba_name: string
	physical_address: string
	phone: string
	usdot_number: string
	mc_mx_ff_number: string
	power_units: string
	out_of_service_date: string
}

export const columnsMapper: CarrierData = {
	created_dt: 'Created_DT',
	data_source_modified_dt: 'Modifed_DT',
	entity_type: 'Entity',
	operating_status: 'Operating status',
	legal_name: 'Legal name',
	dba_name: 'DBA name',
	physical_address: 'Physical address',
	phone: 'Phone',
	usdot_number: 'DOT',
	mc_mx_ff_number: 'MC/MX/FF',
	power_units: 'Power units',
	out_of_service_date: 'Out of service date',
}

export const useCarrierData = () => {
	const [parsedData, setParsedDataData] = useState<CarrierData[]>([])
	const [columns, setColumns] = useState<
		{
			field: string
			headerName: string
			width: number
			type: string
		}[]
	>([])
	const [loading, setLoading] = useState<boolean>(true)

	const csvFilePath = 'data.csv'
	useEffect(() => {
		Papa.parse(csvFilePath, {
			download: true,
			header: true,
			delimiter: ',',
			complete: (result) => {
				const parsedData = result.data as CarrierData[]
				setParsedDataData(parsedData)

				// Extract columns from the keys of the first row
				const headers =
					result.meta.fields
						?.filter((key) => Object.keys(columnsMapper).includes(key))
						.map((key) => ({
							field: key,
							headerName: columnsMapper[key],
							width: 150,
							type: 'string',
						})) || []
				console.log('🚀 ~ useEffect ~ headers:', headers)
				setColumns(headers)

				setLoading(false)
			},
			error: (error) => {
				console.error('Error parsing CSV:', error)
				setLoading(false)
			},
		})
	}, [csvFilePath])

	return { parsedData, columns, loading }
}
