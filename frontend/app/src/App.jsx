import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Quiz from "./quiz-components/quiz/quiz";
import Section from "./quiz-components/section/section";
import CreateQuiz from "./quiz-components/adminQuiz/createQuiz";
import CreateSection from "quiz-components/adminQuiz/createSection";

import Home from "home";

import CommonLayout from "login-components/userLogin/layout/commonLayout";
import { getCurrentUser } from "./login-components/userLogin/api/auth";
import SignIn from "login-components/userLogin/pages/signIn";
import SignUp from "login-components/userLogin/pages/signUp";
import Success from "login-components/userLogin/pages/success";

export const AuthContext = createContext();

function App() {
  // ローディング、ログイン状態、現在のユーザー情報を管理するためのstate
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser(); // Authで定義したメソッドでユーザー情報をAPIから取得

      if (res?.data.isLogin === true) { // ユーザーはログインしている場合
        setIsSignedIn(true); // ユーザーがログインしているというステートをtrueに更新
        setCurrentUser(res?.data.data);
        console.log(res?.data.data);
      } else {
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };


  useEffect(() => { // 現在のユーザー情報を取得
    handleGetCurrentUser();
  }, [setCurrentUser]);


  const Private = ({ children }) => { // 子要素を受け取り、ログイン状態に応じて子要素を表示またはリダイレクトを行う
    const navigate = useNavigate(); 

    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        navigate("/signin");  // 未ログイン時はログインページにリダイレクト
      }
    } else {
      return <></>;
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
      }}
    >
      <Router>
       <CommonLayout>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/confirmation-success" element={<Private><Success /></Private>} />

          <Route path="/home" element={<Home />} />

          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/create-section" element={<CreateSection />} />
          <Route path="/sections" element={<Section />} />
          <Route path="/sections/:sectionId/quizzes" element={<Quiz />} />
        </Routes>
      </CommonLayout>
      </Router>
    </AuthContext.Provider>
);
}

export default App;
