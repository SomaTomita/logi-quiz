import clientRaw from "./clientRaw";
import Cookies from "js-cookie";

interface DashboardData {
  playTime?: number;
  questions_cleared?: number
  sectionResult?: {
    sectionId: number;
    correctAnswers: number;
  };
  learningStack?: {
    date: string;
    totalClear: number;
  };
}

// ダッシュボードデータを保存するための関数
export const saveDashboardData = (data: DashboardData, userId: number) => {
  return clientRaw.post(`/dashboard/${userId}/section_cleared`, {
    play_time: data.playTime,
    questions_cleared: data.questions_cleared,
    section_id: data.sectionResult?.sectionId,
    correct_answers: data.sectionResult?.correctAnswers,
    learning_date: data.learningStack?.date,
    total_clear: data.learningStack?.totalClear
  }, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ダッシュボードデータを取得するための関数
export const fetchDashboardData = (userId: number | string) => {
  return clientRaw.get(`/dashboard/${userId}/dashboard_data`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};