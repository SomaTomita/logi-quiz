import { Link } from "react-router-dom";
import { Button, Container, Typography, Paper } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" paragraph sx={{ marginTop: 2 }}>
        学びたい分野を選ぼう
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/sections"
          sx={{ marginTop: 2, textTransform: "none" }}>
        Go to Sections
        </Button>
        <Paper sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h6" paragraph>
          Rule
        </Typography>
        <Typography variant="body1">
          <ul>
            <li>1セクション10問あり、4つの選択問題だ。</li>
            <li>1問につき、15秒以内に答えよう。</li>
          </ul>
        </Typography>
        </Paper>
      </Paper>
    </Container>
  );
};

export default Home;
