import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useSections } from '../hooks'
import SectionCard from '../components/SectionCard'
import HomeNavFab from '@/shared/components/HomeNavFab'

const SectionListPage = () => {
  const navigate = useNavigate()
  const { sections, isLoading } = useSections()

  const handleSectionClick = (sectionId: number) => {
    navigate(`/sections/${sectionId}/quizzes`)
  }

  return (
    <div style={{ marginBottom: 80 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        セクション選択
      </Typography>
      <SectionCard sections={sections} onSectionClick={handleSectionClick} isLoading={isLoading} />
      <HomeNavFab />
    </div>
  )
}

export default SectionListPage
