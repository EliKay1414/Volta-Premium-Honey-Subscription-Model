import {useState, useEffect, Dispatch, SetStateAction, useCallback, useRef} from 'react'

/**
 * Custom hook that behaves like React's useState, but persists the state
 * automatically to localStorage so values survive page refreshes, and
 * synchronizes in real time across different components and tabs.
 *
 * @param key Unique localStorage key
 * @param defaultValue Default value used if nothing is stored in localStorage
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) {
        return JSON.parse(saved) as T
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    return defaultValue
  })

  // Keep a ref of state to avoid unnecessary re-triggers
  const stateRef = useRef(state)
  stateRef.current = state

  // Listen for storage events (cross-tab) and custom events (same-tab cross-component)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue) as T)
        } catch {}
      }
    }

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{key: string; value: any}>
      if (customEvent.detail && customEvent.detail.key === key) {
        setState(customEvent.detail.value as T)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('vivaldi-storage-update', handleCustomChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('vivaldi-storage-update', handleCustomChange)
    }
  }, [key])

  const setPersistentState: Dispatch<SetStateAction<T>> = useCallback(
    (valueOrFn) => {
      setState((prev) => {
        const nextValue =
          typeof valueOrFn === 'function'
            ? (valueOrFn as (prevState: T) => T)(prev)
            : valueOrFn

        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
          // Dispatch custom event so other components using the same key in this tab update immediately
          window.dispatchEvent(
            new CustomEvent('vivaldi-storage-update', {
              detail: {key, value: nextValue},
            })
          )
        } catch (error) {
          console.warn(`Error saving to localStorage key "${key}":`, error)
        }
        return nextValue
      })
    },
    [key]
  )

  return [state, setPersistentState]
}
