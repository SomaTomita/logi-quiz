import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthGuard, useAdminGuard } from '@/features/auth/hooks'
import Loading from '@/shared/components/Loading'
import AppLayout from '@/shared/layouts/AppLayout'
import LandingLayout from '@/shared/layouts/LandingLayout'
import AdminLayout from '@/shared/layouts/AdminLayout'
import type { ReactNode } from 'react'

// Landing
const LandingPage = lazy(() => import('@/features/home/pages/LandingPage'))

// Auth
const SignInPage = lazy(() => import('@/features/auth/pages/SignInPage'))
const SignUpPage = lazy(() => import('@/features/auth/pages/SignUpPage'))
const PasswordResetPage = lazy(() => import('@/features/auth/pages/PasswordResetPage'))

// App
const SectionListPage = lazy(() => import('@/features/section/pages/SectionListPage'))
const QuizPage = lazy(() => import('@/features/quiz/pages/QuizPage'))
const ProgressPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))

// Admin
const CreateQuizPage = lazy(() => import('@/features/admin/pages/CreateQuizPage'))
const CreateSectionPage = lazy(() => import('@/features/admin/pages/CreateSectionPage'))
const EditQuizPage = lazy(() => import('@/features/admin/pages/EditQuizPage'))
const EditSectionPage = lazy(() => import('@/features/admin/pages/EditSectionPage'))
const UpdateQuizPage = lazy(() => import('@/features/admin/pages/UpdateQuizPage'))

const Private = ({ children }: { children: ReactNode }) => {
  const { isLoading, isSignedIn } = useAuthGuard()
  if (isLoading) return <Loading />
  return isSignedIn ? <>{children}</> : <Navigate to="/signin" replace />
}

const AdminPrivate = ({ children }: { children: ReactNode }) => {
  const { isLoading, isSignedIn, isAdmin } = useAdminGuard()
  if (isLoading) return <Loading />
  return isSignedIn && isAdmin ? <>{children}</> : <Navigate to="/" replace />
}

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      {/* Landing */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth - no layout wrapper, AuthLayout is inside each page */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />

      {/* App */}
      <Route element={<AppLayout />}>
        <Route path="/sections" element={<SectionListPage />} />
        <Route path="/quiz/:sectionId" element={<QuizPage />} />
        <Route
          path="/progress"
          element={
            <Private>
              <ProgressPage />
            </Private>
          }
        />
      </Route>

      {/* Admin */}
      <Route
        element={
          <AdminPrivate>
            <AdminLayout />
          </AdminPrivate>
        }
      >
        <Route path="/admin/sections" element={<EditSectionPage />} />
        <Route path="/admin/sections/new" element={<CreateSectionPage />} />
        <Route path="/admin/quizzes" element={<EditQuizPage />} />
        <Route path="/admin/quizzes/new" element={<CreateQuizPage />} />
        <Route path="/admin/quizzes/:sectionId/:quizId" element={<UpdateQuizPage />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/progress" replace />} />
      <Route path="/sections/:sectionId/quizzes" element={<Navigate to="/sections" replace />} />
      <Route path="/create-quiz" element={<Navigate to="/admin/quizzes/new" replace />} />
      <Route path="/create-section" element={<Navigate to="/admin/sections/new" replace />} />
      <Route path="/edit-quiz" element={<Navigate to="/admin/quizzes" replace />} />
      <Route path="/edit-section" element={<Navigate to="/admin/sections" replace />} />
      <Route path="/auth/password" element={<Navigate to="/reset-password" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
)

export default AppRoutes
