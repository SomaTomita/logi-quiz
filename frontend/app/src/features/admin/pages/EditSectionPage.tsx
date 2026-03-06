import { useState } from 'react'
import { Typography, Grid, Paper, Button, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { useAdminSections } from '../hooks'
import { updateSection, deleteSection } from '../api'
import Loading from '@/shared/components/Loading'
import ConfirmDialog from '@/shared/components/ConfirmDialog'

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

const EditSectionPage = () => {
  const { sections, setSections, isLoading } = useAdminSections()
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null)
  const [updatedSectionName, setUpdatedSectionName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sectionIdToDelete, setSectionIdToDelete] = useState<number | null>(null)

  const handleEditClick = (sectionId: number, sectionName: string) => {
    setEditingSectionId(sectionId)
    setUpdatedSectionName(sectionName)
  }

  const handleSaveClick = async (sectionId: number) => {
    try {
      await updateSection(sectionId, updatedSectionName)
      setSections(
        sections.map((s) => (s.id === sectionId ? { ...s, sectionName: updatedSectionName } : s)),
      )
      setEditingSectionId(null)
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const confirmDelete = async () => {
    if (sectionIdToDelete) {
      try {
        await deleteSection(sectionIdToDelete)
        setSections(sections.filter((s) => s.id !== sectionIdToDelete))
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
    setDeleteDialogOpen(false)
    setSectionIdToDelete(null)
  }

  if (isLoading) return <Loading />

  return (
    <>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Edit Section
      </Typography>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <StyledPaper elevation={2}>
              {editingSectionId === section.id ? (
                <>
                  <TextField
                    value={updatedSectionName}
                    onChange={(e) => setUpdatedSectionName(e.target.value)}
                    size="small"
                  />
                  <div>
                    <StyledButton variant="outlined" onClick={() => setEditingSectionId(null)}>
                      Cancel
                    </StyledButton>
                    <StyledButton variant="outlined" onClick={() => handleSaveClick(section.id)}>
                      Save
                    </StyledButton>
                  </div>
                </>
              ) : (
                <>
                  <p>{section.sectionName}</p>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleEditClick(section.id, section.sectionName)}
                  >
                    Edit
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    onClick={() => {
                      setSectionIdToDelete(section.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    Delete
                  </StyledButton>
                </>
              )}
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm"
        message="Are you sure you want to delete this section?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSectionIdToDelete(null)
        }}
      />
    </>
  )
}

export default EditSectionPage
