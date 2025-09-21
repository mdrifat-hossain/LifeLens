import { useAuth } from "@clerk/clerk-react"

export const useApi = () => {
    const { getToken } = useAuth()

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken()
        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
            ...defaultOptions,
            ...options,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            if (response.status === 429) {
                return { status: "rate_limit_error", reason: "Rate limit exceeded. Basic users can only make 3 requests per hour." }
            }
            return { status: "error", reason: errorData?.detail || "An error occurred" }
        }


        return response.json()
    }

    return { makeRequest }
}