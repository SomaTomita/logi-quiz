import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar-heatmap/dist/styles.css";

import { Typography } from "@mui/material";

import Loading from "../../layout/loading";
import { fetchDashboardData } from "../quizApi/dashBoardApi";
import { AuthContext } from "App";
import DashBoardDisplay from "./dashBoadDisplay";

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
    return <Loading />;
  }
  if (error) {
    return <Typography color="error">エラーが発生しました</Typography>;
  }

  return (
    <DashBoardDisplay
      currentUser={currentUser}
      dashboardData={dashboardData}
      navigate={navigate}
      formatDate={formatDate}
    />
  );
};

export default DashBoard;
