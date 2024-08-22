import TableView from '../components/TableView'
import { useTabContext } from '../context/tab'
import { useCarrierData } from '../util/data'

const Page = () => {
	const { loading, parsedData, columns } = useCarrierData()

	const { currentTab } = useTabContext()

	return (
		<TableView
			key={currentTab}
			tableData={{ loading, parsedData, columns }}
			isPivot={currentTab === 'pivot-table'}
		/>
	)
}

export default Page
