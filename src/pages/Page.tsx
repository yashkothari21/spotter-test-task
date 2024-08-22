import TableView from '../components/TableView'
import { useCarrierData } from '../util/data'

const Page = () => {
	const { loading, parsedData, columns } = useCarrierData()

	return (
		<TableView key='data-table' tableData={{ loading, parsedData, columns }} />
	)
}

export default Page
