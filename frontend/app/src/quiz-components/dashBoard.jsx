import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { Paper, Typography, CircularProgress, Grid, Table, TableBody, TableCell, TableHead, TableRow, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigationIcon from '@mui/icons-material/Navigation';

import { fetchDashboardData } from "./quizApi/dashBoardApi";
import { AuthContext } from "App";

const DashboardWrapper = styled("div")({
  padding: "24px",
  marginBottom: "70px",
});

const ClearedSectionInfo = styled("div")({
  overflowY: "auto",
  maxHeight: "150px",
  padding: "8px",
  border: "1px solid #ccc",
});

const colorScale = [
  "#ebedf0", // 1: 一番薄い色
  "#c6e48b", // 2: 薄めの色
  "#7bc96f", // 4: 濃いめの色
  "#196127", // 6: 一番濃い色
];


const DashBoard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (cleared_at) => {
    const date = new Date(cleared_at);
    // UTC+9時間を追加 (日本のtime zoneに)
    date.setHours(date.getHours() + 9);
    // ISO形式の文字列（YYYY-MM-DDTHH:MM:SS.sssZ）に変換後Tを分割し。その最初の部分（日付の部分）を取得
    const formattedDate = date.toISOString().split("T")[0];
    // formattedTimeでは、split("T")[1]で時間部分（HH:MM:SS.sssZ）を取得
    // 後にsplit(":")で時間、分、秒の部分を分割し、slice(0, 2)で時間と分の部分だけを抽出して join(":")を使用して、時間と分を再び連結
    const formattedTime = date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    const userId = currentUser.id;
    async function fetchData() {
      try {
        const response = await fetchDashboardData(userId);
        setDashboardData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser.id]);
  if (loading) {
    return <CircularProgress />; // ローディング中の表示
  }
  if (error) {
    return <Typography color="error">エラーが発生しました</Typography>;
  }

  return (
    <DashboardWrapper>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 6 }}>
        {currentUser.name}さんのダッシュボード
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
            >
            <Typography variant="h6" sx={{ marginBottom: 1.5 }}>総プレイ時間</Typography>
            <Typography variant="h4">
              {Math.floor(dashboardData.total_play_time / 60)}分
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={1}></Grid> {/*中央のスペース */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3}
            style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
          >
            <Typography variant="h6" sx={{ marginBottom: 1.5 }}>総問題クリア数</Typography>
            <Typography variant="h4">
              {dashboardData.total_questions_cleared}回
            </Typography>
          </Paper>
        </Grid>
        <Grid item md={1.5}></Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6" sx={{ marginBottom: 1.5 }}>過去10回の履歴</Typography>
            <ClearedSectionInfo>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>セクション名</TableCell>
                    <TableCell align="right">正解数</TableCell>
                    <TableCell align="right">クリア日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.cleared_sections.map((section, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {section.section_name}
                      </TableCell>
                      <TableCell align="right">
                        {section.correct_answers}/10
                      </TableCell>
                      <TableCell align="right">
                        {formatDate(section.cleared_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ClearedSectionInfo>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={3}
            style={{ padding: "16px", paddingBottom: "40px", overflowX: "auto", position: "relative" }}
          >
            <Typography variant="h6" sx={{ marginBottom: 1.5 }}>
              学習記録
            </Typography>
            <CalendarHeatmap
              startDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              endDate={new Date()}
              values={dashboardData.study_logs_past_year}
              classForValue={(value) => {
                if (!value) return "color-empty";
                return `color-scale-${value.count}`;
              }}
            />
            <Grid
              style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", position: "absolute", bottom: "8px", right: "16px" }}
            >
              <span style={{ fontSize: "10px", marginRight: "5px" }}>Less</span>
              {colorScale.map((color, index) => (
                <Grid
                  key={index}
                  style={{ width: "15px", height: "15px", backgroundColor: color, margin: "0px 2px" }}
                />
              ))}
              <span style={{ fontSize: "10px", marginLeft: "5px" }}>More</span>
            </Grid>
          </Paper>
         </Grid>
      </Grid>
      <Fab variant="extended" color="primary" sx={{ position: 'fixed', bottom: '24px', right: '24px' }}
          onClick={() => navigate("/home")}
      >
         <NavigationIcon sx={{ mr: 1, textTransform: "none"}} />
         Home
      </Fab>
    </DashboardWrapper>
  );
};

export default DashBoard;
