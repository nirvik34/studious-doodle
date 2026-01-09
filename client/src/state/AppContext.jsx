import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../utils/storage.js'

const AppContext = createContext(null)

const defaultState = {
    auth: { user: null },
    profile: {
        completed: false,
        age: '',
        bpSystolic: 120,
        bpDiastolic: 80,
        diabetes: false,
        smoking: false,
        fast: {
            faceDroop: false,
            armWeakness: false,
            speechDifficulty: false,
            timeCritical: false,
        },
    },
    history: [],
    lastResult: null,
}

export function AppProvider({ children }) {
    const [state, setState] = useState(() => {
        const loaded = loadState()
        return loaded ? { ...defaultState, ...loaded } : defaultState
    })

    useEffect(() => {
        saveState(state)
    }, [state])

    const api = useMemo(() => {
        return {
            state,
            login(email) {
                setState((s) => ({ ...s, auth: { user: { email } } }))
            },
            logout() {
                setState((s) => ({ ...s, auth: { user: null } }))
            },
            updateProfile(partial) {
                setState((s) => ({ ...s, profile: { ...s.profile, ...partial } }))
            },
            setFast(partial) {
                setState((s) => ({
                    ...s,
                    profile: {
                        ...s.profile,
                        fast: { ...s.profile.fast, ...partial },
                    },
                }))
            },
            setLastResult(result) {
                setState((s) => ({ ...s, lastResult: result }))
            },
            addHistory(entry) {
                setState((s) => ({ ...s, history: [entry, ...s.history].slice(0, 25) }))
            },
            resetAll() {
                setState(defaultState)
            },
        }
    }, [state])

    return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within AppProvider')
    return ctx
}
