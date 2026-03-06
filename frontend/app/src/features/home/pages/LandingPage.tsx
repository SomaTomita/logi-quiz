import { Link } from 'react-router-dom'
import { Box, Typography, Button, Container, Grid, Paper, Chip, Stack } from '@mui/material'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import HeroIllustration from '../components/HeroIllustration'

const features = [
  {
    icon: <QuizRoundedIcon sx={{ fontSize: 32 }} />,
    title: '4択クイズ形式',
    description: '各問題は4つの選択肢から回答。テンポよく知識を確認できます。',
  },
  {
    icon: <TimerRoundedIcon sx={{ fontSize: 32 }} />,
    title: '15秒の制限時間',
    description: '1問あたり15秒。程よい緊張感が集中力を引き出します。',
  },
  {
    icon: <MenuBookRoundedIcon sx={{ fontSize: 32 }} />,
    title: '丁寧な解説',
    description: '全問題に解説付き。間違えた問題こそ、最高の学びのチャンスに。',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />,
    title: '学習進捗の可視化',
    description: '正答率・プレイ時間・学習カレンダーで、自分の成長を実感できます。',
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'すぐに始められる',
    description: 'アカウント不要で3回まで無料体験。気に入ったら登録して記録を残そう。',
  },
  {
    icon: <DevicesRoundedIcon sx={{ fontSize: 32 }} />,
    title: 'どこでも学習',
    description: 'スマホでもPCでも快適に。通勤中やスキマ時間を学びの時間に。',
  },
]

const steps = [
  { number: '1', title: 'セクションを選ぶ', description: '学びたい分野のセクションを選択' },
  { number: '2', title: 'クイズに挑戦', description: '10問の4択クイズに15秒以内で回答' },
  { number: '3', title: '結果を確認', description: 'スコアと解説で理解を深める' },
  { number: '4', title: '繰り返し学習', description: '何度でも挑戦して知識を定着' },
]

const benefits = [
  '登録不要で今すぐ体験',
  '1セッション約3分で完了',
  '全問題に解説付き',
  '学習記録を自動保存',
  'スマホ対応のモダンUI',
  '完全無料で利用可能',
]

const LandingPage = () => (
  <>
    {/* Hero */}
    <Box
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, rgba(79, 70, 229, 0.03) 0%, transparent 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              label="3回まで無料で体験"
              variant="outlined"
              color="primary"
              sx={{ mb: 3, fontWeight: 600 }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.25rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                mb: 2.5,
                lineHeight: 1.2,
              }}
            >
              クイズで身につく、
              <br />
              <Box component="span" sx={{ color: 'primary.main' }}>
                国際輸送
              </Box>
              の知識。
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: 460,
              }}
            >
              国際輸送・貿易実務の現場で求められる知識を、4択クイズ形式で効率的に習得。15秒の制限時間が集中力を引き出し、丁寧な解説が理解を深めます。
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                to="/sections"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ px: 5, py: 1.5, fontSize: '1.05rem' }}
              >
                無料で始める
              </Button>
              <Button
                component={Link}
                to="/signin"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                ログイン
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              アカウント登録なしですぐに始められます
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <HeroIllustration />
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* How it works */}
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
          使い方はシンプル
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 7, maxWidth: 480, mx: 'auto' }}
        >
          4ステップで学習が完結。難しい操作は一切ありません。
        </Typography>
        <Grid container spacing={3}>
          {steps.map((step) => (
            <Grid item xs={6} md={3} key={step.number}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {step.number}
                </Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    {/* Features grid */}
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
          logi-quizの特徴
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 7, maxWidth: 480, mx: 'auto' }}
        >
          効率的な学習をサポートする機能を揃えました
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper
                sx={{
                  p: 3.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(79, 70, 229, 0.08)',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 0.75 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    {/* Social proof / benefits */}
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              学習を続けやすい
              <br />
              仕組みがある
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
              1セッションはたった3分。通勤中やお昼休みなど、スキマ時間に気軽に取り組めます。
              学習カレンダーで毎日の積み重ねが可視化されるから、モチベーションが続きます。
            </Typography>
            <Stack spacing={1.5}>
              {benefits.map((benefit) => (
                <Box key={benefit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="body1">{benefit}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(79, 70, 229, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CalendarMonthRoundedIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                    学習カレンダー
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    カレンダー形式で、学習した日がひと目でわかる
                  </Typography>
                </Box>
              </Paper>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <EmojiEventsRoundedIcon sx={{ color: 'secondary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                    スコア記録
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    セクションごとの正答率を記録。成長を実感
                  </Typography>
                </Box>
              </Paper>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUpRoundedIcon sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                    学習ストリーク
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    連続学習日数を表示。毎日の積み重ねが力になる
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* Final CTA */}
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(79, 70, 229, 0.04) 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h2" sx={{ mb: 2 }}>
          さあ、始めよう
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, lineHeight: 1.8, fontSize: '1.05rem' }}
        >
          まずはアカウント不要で3回クイズを体験。
          <br />
          気に入ったら無料登録で、学習記録をすべて保存できます。
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            component={Link}
            to="/sections"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ px: 5, py: 1.5, fontSize: '1.05rem', minWidth: 200 }}
          >
            無料で始める
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5, minWidth: 160 }}
          >
            アカウント作成
          </Button>
        </Stack>
      </Container>
    </Box>

    {/* Footer */}
    <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <Typography variant="body2" color="text.secondary">
        logi-quiz - 国際輸送の知識をクイズで身につける
      </Typography>
    </Box>
  </>
)

export default LandingPage
