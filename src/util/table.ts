import { DateTime } from 'luxon'

export const DATE_FORMAT = 'dd LLL, yyyy hh:mm a'

export const parseDate = (dateString: string) =>
	DateTime.fromFormat(dateString, DATE_FORMAT)

export const compareDates = (date1: string, date2: string) =>
	parseDate(date1) > parseDate(date2) ? -1 : 1
