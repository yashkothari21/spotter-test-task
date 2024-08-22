import { TabProvider } from './context/tab'
import PageLayout from './layout/PageLayout'
import Page from './pages/Page'

function App() {
	return (
		<TabProvider>
			<PageLayout>
				<Page />
			</PageLayout>
		</TabProvider>
	)
}

export default App
