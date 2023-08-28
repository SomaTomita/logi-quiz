import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clientRaw from "./quizApi/clientRaw"

import { Grid, Paper, Typography, Fab } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  fontSize: '16px',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#D3D3D3',
  cursor: 'pointer',
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': { // ホバー時に背景の文字の色変更
    backgroundColor: '#1976d2',
    color: '#ffffff',
  },
  '& p': {
    margin: 0,
  },
}));


function Section() {
  const [sections, setSections] = useState([]); // セクションデータ格納
  const navigate = useNavigate(); // 画面遷移を制御するためのnavigate関数を定義

  useEffect(() => {
    // APIからセクションデータを取得する処理が終了するまで次の行(response)には進まない
    const fetchSections = async () => {
      const response = await clientRaw.get('/sections');
      setSections(response.data);
    }
    fetchSections(); // 非同期関数の呼び出し
  }, []); // 依存配列が空 = コンポーネントが初めてレンダリングされた直後（マウント時）に1回だけ実行

  
  function handleSectionClick(sectionId) {   // クリックされた特定のセクション(引数:sectionId)に画面遷移を行う関数を定義
    navigate(`/sections/${sectionId}/quizzes`);
  }

  return (
   <div className="section-wrapper" style={{ marginBottom: '80px' }}> 
    <Typography variant="h4" gutterBottom sx={{ marginBottom: 5 }}>セクション選択</Typography>

    <Grid container spacing={3} className="section-container">
    {sections.map(section => (
      <Grid item xs={12} sm={6} md={4} key={section.id} onClick={() => handleSectionClick(section.id)}>
        <StyledPaper elevation={3}>
          <p>{section.section_name}</p>
        </StyledPaper>
      </Grid>
    ))}
    </Grid>
    <Fab variant="extended" color="primary" sx={{ position: 'fixed', bottom: '24px', right: '24px' }}
      onClick={() => navigate("/home")}
    >
      <NavigationIcon sx={{ mr: 1, textTransform: "none"}} />Home
    </Fab>
   </div>
  );
}

export default Section;