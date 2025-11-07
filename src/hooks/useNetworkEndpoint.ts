import { useState } from 'react'

const DEFAULT_API_URL = 'https://nodes.amadeus.bot/api'

/**
 * Hook for managing network endpoint configuration
 */
export function useNetworkEndpoint() {
	const [apiEndpoint, setApiEndpoint] = useState(DEFAULT_API_URL)
	return { apiEndpoint, setApiEndpoint }
}
