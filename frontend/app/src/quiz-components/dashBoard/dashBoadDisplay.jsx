import { Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Fab } from "@mui/material";
import CalendarHeatmap from "react-calendar-heatmap";
import NavigationIcon from "@mui/icons-material/Navigation";
import { styled } from "@mui/material/styles";

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
  "#ebedf0",
  "#c6e48b",
  "#7bc96f",
  "#196127",
];


const DashBoardDisplay = ({ currentUser, dashboardData, navigate, formatDate }) => (
    <DashboardWrapper>
    <Typography variant="h4" gutterBottom sx={{ marginBottom: 6 }}>
      {currentUser.name}さんのダッシュボード
    </Typography>

    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Paper elevation={3}
          sx={{ padding: "16px", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginBottom: 3, }}
        >
          <Typography variant="h5" sx={{ marginBottom: 1.5 }}>
            総プレイ時間
          </Typography>
          <Typography variant="h4">
            {Math.floor(dashboardData.total_play_time / 60)}分
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={1}></Grid> {/*中央のスペース */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3}
          sx={{ padding: "16px", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginBottom: 3, }}
        >
          <Typography variant="h5" sx={{ marginBottom: 1.5 }}>
            総問題クリア数
          </Typography>
          <Typography variant="h4">
            {dashboardData.total_questions_cleared}回
          </Typography>
        </Paper>
      </Grid>
      <Grid item md={2}></Grid>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ padding: "24px", borderRadius: 4,  }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>過去10回の履歴</Typography>
          <ClearedSectionInfo>
            <Table stickyHeader size="small" sx={{ marginBottom: 2 }}>
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
        <Paper
          elevation={3}
          sx={{ padding: "16px", marginTop: 2, borderRadius: 4, paddingBottom: "40px", overflowX: "auto", position: "relative", }}
        >
          <Typography variant="h5" sx={{ marginBottom: 1.5 }}>
            学習記録
          </Typography>
          <CalendarHeatmap
            startDate={ new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={dashboardData.study_logs_past_year}
            classForValue={(value) => {
              if (!value) return "color-empty";
              return `color-scale-${value.count}`;
            }}
          />
          <Grid
            sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", position: "absolute", bottom: "8px", right: "16px", }}
          >
            <span style={{ fontSize: "10px", marginRight: "5px" }}>Less</span>
            {colorScale.map((color, index) => (
              <Grid key={index}
                style={{ width: "15px", height: "15px", backgroundColor: color, margin: "0px 2px", }}
              />
            ))}
            <span style={{ fontSize: "10px", marginLeft: "5px" }}>More</span>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
    <Fab variant="extended" color="primary" sx={{ position: "fixed", bottom: "24px", right: "24px" }}
      onClick={() => navigate("/home")}
    >
      <NavigationIcon sx={{ mr: 1, textTransform: "none" }} />
      Home
    </Fab>
  </DashboardWrapper>
);

export default DashBoardDisplay;
