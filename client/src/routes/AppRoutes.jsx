import { Navigate, Route, Routes } from 'react-router-dom'
import { PATHS } from './paths.js'
import { RequireAuth } from './RequireAuth.jsx'

import { LandingPage } from '../pages/LandingPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { SignupPage } from '../pages/SignupPage.jsx'
import { ProfileWizardPage } from '../pages/ProfileWizardPage.jsx'
import { AppTourPage } from '../pages/AppTourPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'
import { ScanPage } from '../pages/ScanPage.jsx'
import { ResultsPage } from '../pages/ResultsPage.jsx'
import { HistoryPage } from '../pages/HistoryPage.jsx'
import { HospitalFinderPage } from '../pages/HospitalFinderPage.jsx'
import { EmergencyConfirmPage } from '../pages/EmergencyConfirmPage.jsx'
import { RecommendationsPage } from '../pages/RecommendationsPage.jsx'

export function AppRoutes() {
    return (
        <Routes>
            <Route path={PATHS.landing} element={<LandingPage />} />
            <Route path={PATHS.login} element={<LoginPage />} />
            <Route path={PATHS.signup} element={<SignupPage />} />

            <Route
                path={PATHS.profile}
                element={
                    <RequireAuth>
                        <ProfileWizardPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.tour}
                element={
                    <RequireAuth>
                        <AppTourPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.dashboard}
                element={
                    <RequireAuth>
                        <DashboardPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.scan}
                element={
                    <RequireAuth>
                        <ScanPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.results}
                element={
                    <RequireAuth>
                        <ResultsPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.history}
                element={
                    <RequireAuth>
                        <HistoryPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.hospitals}
                element={
                    <RequireAuth>
                        <HospitalFinderPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.emergency}
                element={
                    <RequireAuth>
                        <EmergencyConfirmPage />
                    </RequireAuth>
                }
            />

            <Route
                path={PATHS.recommendations}
                element={
                    <RequireAuth>
                        <RecommendationsPage />
                    </RequireAuth>
                }
            />

            <Route path="*" element={<Navigate to={PATHS.landing} replace />} />
        </Routes>
    )
}
