import { useState, useEffect, useRef } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'

// Uncomment this import when you are ready to wire up the search logic:
// import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  useEffect(() => {
    let isActive = true

    const timerId = setTimeout(() => {
      const currentRequestId = ++requestIdRef.current
      setIsLoading(true)
      setError(null)

      searchItems(query)
        .then(items => {
          if (!isActive || currentRequestId !== requestIdRef.current) return
          setResults(items)
          setIsLoading(false)
        })
        .catch(() => {
          if (!isActive || currentRequestId !== requestIdRef.current) return
          setError('Something went wrong while searching. Please try again.')
          setIsLoading(false)
        })
    }, 300)

    return () => {
      isActive = false
      clearTimeout(timerId)
    }
  }, [query])

  return { query, setQuery, results, isLoading, error }
}
