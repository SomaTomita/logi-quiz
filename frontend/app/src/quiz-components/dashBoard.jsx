import { useEffect, useState, useContext } from 'react';
import { Paper, Typography, LinearProgress, Button, Grid, Avatar,  Stack, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fetchDashboardData } from './quizApi/dashBoardApi';
import { AuthContext } from "App";

const DashboardWrapper = styled('div')({
    padding: '24px'
});

const ClearedSectionInfo = styled('div')({
    overflowY: 'auto',
    maxHeight: '150px',
    padding: '8px',
    border: '1px solid #ccc',
});



const DashBoard =() => {
    const { currentUser } = useContext(AuthContext);

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = currentUser.id
        async function fetchData() {
            try {
                const response = await fetchDashboardData(userId);
                setDashboardData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    if (loading) {
        return <LinearProgress />; // ローディング中の表示
    }
    if (error) {
        return <Typography color="error">エラーが発生しました</Typography>;
    }


    return (
        <DashboardWrapper>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">総プレイ時間</Typography>
                        <Typography variant="h4">{dashboardData.total_play_time}秒</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">総問題クリア数</Typography>
                        <Typography variant="h4">{dashboardData.total_questions_cleared}クリア</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">履歴</Typography>
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
                                            <TableCell align="right">{section.correct_answers}</TableCell>
                                            <TableCell align="right">{section.cleared_at}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ClearedSectionInfo>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">学習記録</Typography>
                        <CalendarHeatmap
                            startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
                            endDate={new Date()}
                            values={dashboardData.study_logs_past_month}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </DashboardWrapper>
    );
};
export default DashBoard;