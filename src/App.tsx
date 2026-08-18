import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from './lib/authStore'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import AuthPage from './pages/Auth'
import Onboarding from './pages/Onboarding'
import DashboardLayout, { FullLoader } from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import CareerDNA from './pages/CareerDNA'
import SkillGap from './pages/SkillGap'
import Roadmap from './pages/Roadmap'
import Mentor from './pages/Mentor'
import Profile from './pages/Profile'
import CareerGoals from './pages/CareerGoals'
import Resources from './pages/Resources'
import Billing from './pages/Billing'
import Admin from './pages/Admin'
import { usePageFade } from './lib/motionVariants'

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading, profile } = useAuthStore()
  if (loading) return <FullLoader />
  if (!user) return <Navigate to="/auth" replace />
  // First login with no career prefs → onboarding (but allow skip)
  if (profile && !profile.experience_level && !profile.preferred_work_style && (profile.target_roles ?? []).length === 0 && window.location.pathname !== '/onboarding' && !sessionStorage.getItem('onboarded')) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading, profile } = useAuthStore()
  if (loading) return <FullLoader />
  if (!user) return <Navigate to="/auth" replace />
  if (profile?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuthStore()
  const location = useLocation()
  const pageFade = usePageFade()

  return (
    <AnimatePresence mode="wait">
    <motion.div key={location.pathname} initial={pageFade.initial} animate={pageFade.animate} exit={pageFade.exit}>
    <Routes location={location}>
      <Route path="/" element={loading ? <FullLoader /> : user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={loading ? <FullLoader /> : user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
      <Route element={<Protected><DashboardLayout /></Protected>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/career-goals" element={<CareerGoals />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/career-dna" element={<CareerDNA />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/billing" element={<Billing />} />
      </Route>
      <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </motion.div>
    </AnimatePresence>
  )
}
