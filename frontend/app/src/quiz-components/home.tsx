import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Typography, Paper, Alert } from "@mui/material";
import { AuthContext } from "App";


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  const handleDashboardClick = () => {
    if (isSignedIn) {
      navigate("/dashboard"); // ログインしていたらダッシュボード画面へ
    } else {
      setShowAlert(true); // ログインしていない場合アラート表示
    }
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        HOME
      </Typography>
      <Paper sx={{ padding: 4, marginTop: 2, marginBottom: 5, borderRadius: 5, }}>
        <Typography variant="h5" paragraph sx={{ marginTop: 2, fontWeight: 'bold' }}>
          まず学びたい分野を選んで問題に挑戦しましょう。
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 1.5 }}>
          <Button variant="contained" size="large" component={Link} to="/sections" role="button"
            sx={{ padding: 2, marginTop: 2, textTransform: "none", fontSize: '1.1rem',}}>
            Go to Sections
          </Button>
        </div>

        <Typography variant="h6" paragraph sx={{ marginTop: 3.5 }}>
          ＜クイズの遊び方＞
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
      <Paper sx={{ padding: 4, marginTop: 3.5, marginBottom: 3, borderRadius: 5, }}>
        <Typography variant="h5" paragraph sx={{ fontWeight: 'bold' }}>
          次に学習状況を確認しましょう。
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 1.5 }}>
          <Button variant="contained" size="large"
            onClick={handleDashboardClick} sx={{ padding: 2, marginTop: 2, textTransform: "none", fontSize: '1.1rem', }}>
            Go to Dashboard
          </Button>
        </div>
        <Typography variant="h6" paragraph sx={{ marginTop: 3.5 }}>
          ＜ダッシュボードの使い方＞
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            {!isSignedIn && (
              <li>こちらの機能の使用は<a href="http://localhost:3000/signin" style={{ fontSize: '1.2rem', color: '#007BFF' }}>
              ログイン</a>が必須となります。</li>
            )}
            <li>総プレイ時間、総問題クリア数、過去10回の履歴、学習記録が見られます。</li>
            <li>学習記録では問題をクリアするだけ色が濃くなりカレンダー上に記録されます。</li>
          </ul>
        </Typography>

        {showAlert && (
          <Alert severity="warning" onClose={() => setShowAlert(false)} sx={{ marginTop: 3 }}>
            let's login!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
