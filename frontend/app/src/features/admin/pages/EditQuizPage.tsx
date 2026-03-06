import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Paper, Typography, Button } from '@mui/material'
import { styled } from '@mui/system'
import { useAdminSections } from '../hooks'
import { fetchAdminQuizzes, deleteQuiz } from '../api'
import Loading from '@/shared/components/Loading'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import type { Quiz } from '@/features/quiz/types'

const StyledPaper = styled(Paper)({
  fontSize: '16px',
  textAlign: 'center',
  padding: '20px',
  '& p': { margin: 0 },
})

const StyledButton = styled(Button)({
  margin: '5px',
  borderColor: '#64748b',
  '&:hover': { backgroundColor: '#0d9488', color: '#ffffff', borderColor: '#0d9488' },
  color: '#1e293b',
})

const EditQuizPage = () => {
  const { sections, isLoading } = useAdminSections()
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizIdToDelete, setQuizIdToDelete] = useState<number | null>(null)
  const [loadingQuizzes, setLoadingQuizzes] = useState(false)
  const navigate = useNavigate()

  const handleSectionClick = async (sectionId: number) => {
    setLoadingQuizzes(true)
    try {
      const res = await fetchAdminQuizzes(sectionId)
      setQuizzes(res.data)
      setSelectedSection(sectionId)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoadingQuizzes(false)
    }
  }

  const confirmDelete = async () => {
    if (quizIdToDelete && selectedSection) {
      try {
        await deleteQuiz(selectedSection, quizIdToDelete)
        setQuizzes(quizzes.filter((q) => q.id !== quizIdToDelete))
      } catch (error) {
        console.error('Error deleting quiz:', error)
      }
    }
    setDeleteDialogOpen(false)
    setQuizIdToDelete(null)
  }

  if (isLoading) return <Loading />

  return (
    <>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Select Section and Edit Quiz
      </Typography>
      <div>
        {sections.map((section) => (
          <StyledButton
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            {section.sectionName}
          </StyledButton>
        ))}
      </div>

      {loadingQuizzes ? <Loading /> : null}

      {selectedSection && !loadingQuizzes ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <StyledPaper elevation={2}>
                <p>{quiz.questionText}</p>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate(`/admin/quizzes/${selectedSection}/${quiz.id}`)}
                >
                  Edit
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setQuizIdToDelete(quiz.id)
                    setDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </StyledButton>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      ) : null}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm"
        message="Are you sure you want to delete this quiz?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setQuizIdToDelete(null)
        }}
      />
    </>
  )
}

export default EditQuizPage
