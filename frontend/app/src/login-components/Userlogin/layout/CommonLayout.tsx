// App.jsxでは、全ページのコンポーネントをchidlrenとして、ヘッダーコンポーネントを表示し、コンテナの最大幅で中央揃えでレンダリングする

import { Container, Grid } from "@mui/material";
import Header from "./header"

interface CommonLayoutProps {
  children: React.ReactElement; // ReactElement = コンポーネント（または DOM タグ）の型、それが受け取る props、そして子要素を保持する型付け
}

const CommonLayout = ({ children }: CommonLayoutProps) => { // <CommonLayout> ~~ </CommonLayout> ~~ 部分をchildrenとしてCommonLayoutコンポーネントに渡され ~~ の位置ににレンダリング
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
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
