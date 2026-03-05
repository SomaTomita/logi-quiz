import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Container, Typography, Paper, Alert, Box } from '@mui/material'
import { useAuthStore } from '@/features/auth/store'

const HomePage = () => {
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const [showAlert, setShowAlert] = useState(false)

  const handleDashboardClick = () => {
    if (isSignedIn) {
      navigate('/dashboard')
    } else {
      setShowAlert(true)
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
        遊び方
      </Typography>
      <Paper sx={{ p: 4, mt: 2, mb: 5 }}>
        <Typography variant="h5" paragraph sx={{ mt: 2, fontWeight: 'bold' }}>
          まず学びたい分野を選んで問題に挑戦しましょう。
        </Typography>
        <Box display="flex" justifyContent="center" mt={1.5}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/sections"
            sx={{ p: 2, mt: 2, fontSize: '1.1rem' }}
          >
            Go to Sections
          </Button>
        </Box>
        <Typography variant="h6" paragraph sx={{ mt: 3.5 }}>
          ＜クイズ＞
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>1セクション10問出題され、4つの選択問題です。</li>
            <li>1問につき、15秒以内に答えましょう。</li>
            <li>一度Nextボタンで解答を終えると、前の問題には戻れません。</li>
            <li>最後の問題で、Finishボタンを押すと結果と解説が出ます。</li>
            <li>再度同じセクションをする場合は、Try againボタンを押しましょう。</li>
            <li>別の問題をしたい場合は、Back to Sectionsボタンを押しましょう。</li>
          </ul>
        </Typography>
      </Paper>
      <Paper sx={{ p: 4, mt: 3.5, mb: 3 }}>
        <Typography variant="h5" paragraph sx={{ fontWeight: 'bold' }}>
          次に学習状況を確認しましょう。
        </Typography>
        <Box display="flex" justifyContent="center" mt={1.5}>
          <Button
            variant="contained"
            size="large"
            onClick={handleDashboardClick}
            sx={{ p: 2, mt: 2, fontSize: '1.1rem' }}
          >
            Go to Dashboard
          </Button>
        </Box>
        <Typography variant="h6" paragraph sx={{ mt: 3.5 }}>
          ＜ダッシュボード＞
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            {!isSignedIn ? <li>こちらの機能の使用はログインが必須となります。</li> : null}
            <li>総プレイ時間、総問題クリア数、過去10回の履歴、学習記録が見られます。</li>
            <li>学習記録では問題をクリアするだけ色が濃くなりカレンダー上に記録されます。</li>
          </ul>
        </Typography>
        {showAlert ? (
          <Alert severity="warning" onClose={() => setShowAlert(false)} sx={{ mt: 3 }}>
            Let&apos;s login!
          </Alert>
        ) : null}
      </Paper>
    </Container>
  )
}

export default HomePage
