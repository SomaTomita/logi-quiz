import { Link } from "react-router-dom";
import { Button, Container, Typography, Paper } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 4, marginTop: 2, marginBottom: 3 }}>
        <Typography variant="h5" paragraph sx={{ marginTop: 2, fontWeight: 'bold' }}>
          まず学びたい分野を選んで問題に挑戦しましょう。
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 1.5 }}>
          <Button variant="contained" size="large" component={Link} to="/sections"
            sx={{ padding: 2, marginTop: 2, textTransform: "none" }}>
            Go to Sections
          </Button>
        </div>

        <Typography variant="h6" paragraph sx={{ marginTop: 3.5 }}>
          ＜クイズの遊び方＞
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>1セクション10問あり、4つの選択問題です。</li>
            <li>1問につき、15秒以内に答えましょう。</li>
            <li>解答を選ぶとNextボタンで次の問題へ行きましょう。</li>
            <li>一度次の問題へ行くと前の問題には戻れません。</li>
            <li>最後の問題でFinishボタンを押すと結果と解説が出ます。</li>
            <li>再度同じセクションをする場合はTry againボタンを押しましょう。</li>
            <li>別の問題をしたい場合はBack to Sectionsボタンを押しましょう。</li>
          </ul>
        </Typography>
      </Paper>
      <Paper sx={{ padding: 4, marginTop: 3.5, marginBottom: 3 }}>
        <Typography variant="h5" paragraph sx={{ fontWeight: 'bold' }}>
          次に学習状況を確認しましょう。
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 1.5 }}>
          <Button variant="contained" size="large" component={Link} to="/dashboard"
            sx={{ padding: 2, marginTop: 2, textTransform: "none" }}>
            Go to Dashboard
          </Button>
          </div>
          <Typography variant="h6" paragraph sx={{ marginTop: 3.5 }}>
            ＜ダッシュボードの使い方＞
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>総プレイ時間、総問題クリア数、過去10回の履歴、学習記録が見れます。</li>
              <li>学習記録では問題をクリアするだけ色が濃くなりカレンダー上に記録されます。</li>
            </ul>
          </Typography>
        
      </Paper>
    </Container>
  );
};

export default Home;
