interface FormattedData {
	month: string
	[entityType: string]: string | number
}

interface MonthEntityCount {
	[month: string]: {
		[entityType: string]: number
	}
}

interface ParsedData {
	dateMonth?: string
	dateYear?: string
	dateWeek?: string
}

interface CountData {
	[key: string]: number
}

const computeCountData = (
	parsedData: ParsedData[],
	dateKey: keyof ParsedData
): { [key: string]: number } => {
	return parsedData.reduce((acc: CountData, curr) => {
		const key = curr[dateKey] as string
		if (key) {
			acc[key] = (acc[key] || 0) + 1
		}
		return acc
	}, {})
}

const formatCountData = (countData: CountData, label: string) =>
	Object.keys(countData).map((key) => ({
		[label]: key,
		count: countData[key],
	}))

export const getMonthWiseDataCount = (parsedData: ParsedData[]) =>
	formatCountData(computeCountData(parsedData, 'dateMonth'), 'month')

export const getYearWiseDataCount = (parsedData: ParsedData[]) =>
	formatCountData(computeCountData(parsedData, 'dateYear'), 'year')

export const getWeekWiseDataCount = (parsedData: ParsedData[]) =>
	formatCountData(computeCountData(parsedData, 'dateWeek'), 'week')

export const pivotChartData: Record<string, (data: ParsedData[]) => any[]> = {
	Week: getWeekWiseDataCount,
	Month: getMonthWiseDataCount,
	Year: getYearWiseDataCount,
}

// Aggregates the count of entities per month
export const aggregateEntityCountsByMonth = (
	data: Array<{ created_dt: string; entity_type: string }>
): MonthEntityCount => {
	return data.reduce((acc: MonthEntityCount, { created_dt, entity_type }) => {
		const date = new Date(created_dt)
		const month = date.toLocaleString('en-US', { month: 'long' })

		if (!acc[month]) {
			acc[month] = {}
		}

		acc[month][entity_type] = (acc[month][entity_type] || 0) + 1

		return acc
	}, {})
}

// Transforms the aggregated data into a formatted array
export const formatDataForChart = (
	monthEntityCount: MonthEntityCount,
	allEntityTypes: string[]
): FormattedData[] => {
	return Object.entries(monthEntityCount).map(([month, counts]) => ({
		month,
		...Object.fromEntries(
			allEntityTypes.map((type) => [type, counts[type] ?? 0])
		),
	}))
}

// Collects unique entity types from the data
export const getUniqueEntityTypes = (
	data: Array<{ entity_type: string }>
): string[] => {
	return Array.from(new Set(data.map(({ entity_type }) => entity_type)))
}
