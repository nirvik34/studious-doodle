import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../state/AppContext.jsx'
import { PATHS } from './paths.js'

export function RequireAuth({ children }) {
    const { state } = useApp()
    const loc = useLocation()

    if (!state.auth.user) {
        return <Navigate to={PATHS.login} replace state={{ from: loc.pathname }} />
    }

    return children
}
