import { Link } from "react-router-dom";
import { Button, Container, Typography, Paper } from "@mui/material";

// Home画面コンポーネント
const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          貿易クイズ
        </Typography>
        <Typography variant="body1" paragraph>
          国際物流の知識を手軽に復習できるクイズアプリです。<br />
          復習したい内容や学習テーマに合わせて復習することが出来ます。
        </Typography>


        <Typography variant="body1" paragraph>
         下のボタンから学びたい分野を選ぼう！
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/sections"
          sx={{ marginTop: 2 }}
        >
          Go to sections
        </Button>
      </Paper>
    </Container>
  );
};

export default Home;
