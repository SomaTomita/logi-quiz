import { Container, Grid } from "@mui/material";
import Header from "./header"

interface CommonLayoutProps {
  children: React.ReactElement;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main> {/* App.jsxでは、全ページのコンポーネントをchidlrenとして、ヘッダーコンポーネントを表示し、コンテナの最大幅で中央揃えでレンダリングする */}
        <Container maxWidth="lg" sx={{ marginTop: "3rem" }}>
          <Grid container justifyContent="center">
            <Grid item>
              {children}
            </Grid>   
          </Grid>
        </Container>
      </main>
    </>
  );
}

export default CommonLayout;
