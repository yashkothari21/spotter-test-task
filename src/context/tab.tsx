import { PropsWithChildren, createContext, useContext, useState } from 'react'

// Define the shape of the context value
interface TabContextType {
	currentTab: string
	changeTab: (newTab: string) => void
}

// Create context with default value as undefined
const TabContext = createContext<TabContextType | undefined>(undefined)

// Define provider props interface
interface TabProviderProps extends PropsWithChildren {
	defaultTab?: string
}

// Provider component
export const TabProvider = ({
	children,
	defaultTab = 'data-table',
}: TabProviderProps) => {
	const [currentTab, setCurrentTab] = useState(defaultTab)

	const changeTab = (newTab: string) => {
		setCurrentTab(newTab)
	}

	const value = { currentTab, changeTab }

	return <TabContext.Provider value={value}>{children}</TabContext.Provider>
}

// Custom hook to use tab context
export const useTabContext = (): TabContextType => {
	const context = useContext(TabContext)
	if (context === undefined) {
		throw new Error('useTabContext must be used within a TabProvider')
	}
	return context
}
