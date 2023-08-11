import { Container, Grid } from "@mui/material";
import Header from "./Header";

interface CommonLayoutProps {
  children: React.ReactElement;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
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
