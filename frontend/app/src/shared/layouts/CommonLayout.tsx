import { Container, Grid } from '@mui/material'
import Header from './Header'

interface CommonLayoutProps {
  children: React.ReactNode
}

const CommonLayout = ({ children }: CommonLayoutProps) => (
  <>
    <header>
      <Header />
    </header>
    <main>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </main>
  </>
)

export default CommonLayout
