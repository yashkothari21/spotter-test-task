import { BarChart, axisClasses } from '@mui/x-charts'
import { FC, useMemo } from 'react'

import {
	aggregateEntityCountsByMonth,
	getUniqueEntityTypes,
	formatDataForChart,
} from '../util/chart'

interface SeriesConfig {
	dataKey: string
	label: string
	color: string
}

const generateSeriesConfig = (
	data: Array<Record<string, unknown>>
): SeriesConfig[] => {
	if (data.length === 0) return []

	return Object.keys(data[0])
		.filter((key) => key !== 'month')
		.map((key) => ({
			dataKey: key,
			label: key,
			color: 'white',
		}))
}

const DataTableChart: FC<any> = ({ chartData }) => {
	const chartTableData = useMemo(() => {
		const aggregateData = aggregateEntityCountsByMonth(chartData)
		const entityType = getUniqueEntityTypes(chartData)

		return formatDataForChart(aggregateData, entityType)
	}, [chartData])

	const seriesConfig = useMemo(
		() => generateSeriesConfig(chartTableData),
		[chartTableData]
	)

	return (
		<BarChart
			dataset={chartTableData}
			yAxis={[{ label: 'Count' }]}
			xAxis={[
				{
					scaleType: 'band',
					dataKey: 'month',
					label: 'Month',
				},
			]}
			series={seriesConfig}
			slotProps={{
				legend: {
					hidden: true,
					labelStyle: {
						fontSize: 12,
						display: 'none',
					},
				},
			}}
			height={600}
			sx={{
				[`& .${axisClasses.root} .${axisClasses.tickLabel}`]: {
					fill: 'white',
				},
				[`& .${axisClasses.root} .${axisClasses.line}, & .${axisClasses.root} .${axisClasses.tick}`]:
					{
						stroke: 'white',
					},
				[`& .${axisClasses.root} .${axisClasses.label}`]: {
					fill: 'white',
					fontWeight: 700,
				},
				[`& .${axisClasses.left} .${axisClasses.label}`]: {
					transform: 'translateX(-15px)',
				},
				backgroundColor: 'black',
				border: '5px solid gray',
				backgroundSize: '35px 35px',
				backgroundImage: `linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)`,
			}}
		/>
	)
}

export default DataTableChart
