import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate,} from "react-router-dom";

import Quiz from "./quiz-components/quiz";
import Section from "./quiz-components/section";
import CreateQuiz from "./quiz-components/adminQuiz/createQuiz";
import CreateSection from "./quiz-components/adminQuiz/createSection";
import EditSection from  "./quiz-components/adminQuiz/editSection";
import EditQuiz from "./quiz-components/adminQuiz/editQuiz";
import UpdateQuiz from "./quiz-components/adminQuiz/updateQuiz";
import DashBoard from "./quiz-components/dashBoard";
import Home from "./quiz-components/home";

import CommonLayout from "./layout/commonLayout";
import { getCurrentUser } from "./login-components/api/auth";
import SignIn from "./login-components/pages/signIn";
import SignUp from "./login-components/pages/signUp";
import Success from "./login-components/pages/success";

export const AuthContext = createContext();

function App() {
  // ローディング、ログイン状態、現在のユーザー情報を管理するためのstate
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser(); // Authで定義した(/auth/sessionsでユーザー情報をgetした)メソッドでユーザー情報をAPIから取得

      if (res?.data.isLogin === true) {
        // 取得したデータが"is_login": trueである(ユーザーはログインしている)場合
        setIsSignedIn(true);
        setCurrentUser(res?.data.data); // APIのレスポンスdata本体のdataキー内のオブジェクト(ID、メールアドレス、名前)を取得してcurrentUserに
        setIsAdmin(res?.data.data.admin); // data内のadminがtrueであれば、setAdminを渡りisAdminがtrueになる(adminユーザーであるかどうかの判定)
      } else {
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };


  useEffect(() => {
    // 現在のユーザー情報を取得
    handleGetCurrentUser();
  }, []);


  const Private = ({ children }) => {
    // <private>子要素<pricate/> こちらのように子要素を受け取り、ログイン状態に応じて子要素を表示またはリダイレクトを行う
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isSignedIn) {
        navigate("/home");
      }
    }, [loading, isSignedIn, navigate]);

    if (!loading) {
      if (isSignedIn) {
        return children; // ログインしている場合は、子要素をreturn以下で言う<Success />を表示
      } else {
        return <></>;
      }
    }
  };


  const AdminPrivate = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && (!isSignedIn || !isAdmin)) {
        navigate("/home");
      }
    }, [loading, isSignedIn, isAdmin, navigate]);

    if (!loading) {
      if (isSignedIn && isAdmin) {
        return children; // ログインしており、かつadminの場合は、子要素をreturn
      } else {
        return <></>;
      }
    }
  };

  return (
    // AuthContextを提供して、子コンポーネントで認証情報にアクセス可能にする
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isSignedIn,
        setIsSignedIn,
        currentUser,
        setCurrentUser,
        isAdmin,
        setIsAdmin,
      }}
    >
      <Router>
       <CommonLayout>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> 

          <Route path="/confirmation-success" element={<Private><Success /></Private>} />
          <Route path="/home" element={<Private><Home /></Private>} />
          <Route path="/sections" element={<Private><Section /></Private>} />
          <Route path="/sections/:sectionId/quizzes" element={<Private><Quiz /></Private>} />
          <Route path="/dashboard" element={<Private><DashBoard /></Private>} />

          <Route path="/create-quiz" element={<AdminPrivate><CreateQuiz /></AdminPrivate>} />
          <Route path="/create-section" element={<AdminPrivate><CreateSection /></AdminPrivate>} />
          <Route path="/edit-quiz" element={<AdminPrivate><EditQuiz /></AdminPrivate>} />
          <Route path="/update-quiz/:sectionId/:quizId" element={<AdminPrivate><UpdateQuiz /></AdminPrivate>} />
          <Route path="/edit-section" element={<AdminPrivate><EditSection /></AdminPrivate>} />

        </Routes>
      </CommonLayout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;