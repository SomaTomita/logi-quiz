import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuthGuard, useAdminGuard } from '@/features/auth/hooks'
import Loading from '@/shared/components/Loading'
import SignInPage from '@/features/auth/pages/SignInPage'
import type { ReactNode } from 'react'

const SignUpPage = lazy(() => import('@/features/auth/pages/SignUpPage'))
const PasswordResetPage = lazy(() => import('@/features/auth/pages/PasswordResetPage'))
const SuccessPage = lazy(() => import('@/features/auth/pages/SuccessPage'))
const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const SectionListPage = lazy(() => import('@/features/section/pages/SectionListPage'))
const QuizPage = lazy(() => import('@/features/quiz/pages/QuizPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))

const CreateQuizPage = lazy(() => import('@/features/admin/pages/CreateQuizPage'))
const CreateSectionPage = lazy(() => import('@/features/admin/pages/CreateSectionPage'))
const EditQuizPage = lazy(() => import('@/features/admin/pages/EditQuizPage'))
const EditSectionPage = lazy(() => import('@/features/admin/pages/EditSectionPage'))
const UpdateQuizPage = lazy(() => import('@/features/admin/pages/UpdateQuizPage'))

const Private = ({ children }: { children: ReactNode }) => {
  const { isLoading, isSignedIn } = useAuthGuard()
  if (isLoading) return <Loading />
  return isSignedIn ? <>{children}</> : null
}

const AdminPrivate = ({ children }: { children: ReactNode }) => {
  const { isLoading, isSignedIn, isAdmin } = useAdminGuard()
  if (isLoading) return <Loading />
  return isSignedIn && isAdmin ? <>{children}</> : null
}

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/password" element={<PasswordResetPage />} />
      <Route
        path="/confirmation-success"
        element={
          <Private>
            <SuccessPage />
          </Private>
        }
      />
      <Route path="/home" element={<HomePage />} />
      <Route path="/sections" element={<SectionListPage />} />
      <Route path="/sections/:sectionId/quizzes" element={<QuizPage />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <DashboardPage />
          </Private>
        }
      />
      <Route
        path="/create-quiz"
        element={
          <AdminPrivate>
            <CreateQuizPage />
          </AdminPrivate>
        }
      />
      <Route
        path="/create-section"
        element={
          <AdminPrivate>
            <CreateSectionPage />
          </AdminPrivate>
        }
      />
      <Route
        path="/edit-quiz"
        element={
          <AdminPrivate>
            <EditQuizPage />
          </AdminPrivate>
        }
      />
      <Route
        path="/update-quiz/:sectionId/:quizId"
        element={
          <AdminPrivate>
            <UpdateQuizPage />
          </AdminPrivate>
        }
      />
      <Route
        path="/edit-section"
        element={
          <AdminPrivate>
            <EditSectionPage />
          </AdminPrivate>
        }
      />
    </Routes>
  </Suspense>
)

export default AppRoutes
