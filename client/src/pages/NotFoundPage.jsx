import { Button } from '../components/Button.jsx'
import { PATHS } from '../routes/paths.js'

export function NotFoundPage() {
    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Page not found</h1>
                <p className="subtle">Return to the start.</p>
            </div>
            <Button to={PATHS.landing} variant="primary">
                Go to landing
            </Button>
        </div>
    )
}
