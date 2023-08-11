import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Quiz from "./quiz-components/Quiz/Quiz";
import Section from "./quiz-components/Section/Section";
import CreateQuiz from "./quiz-components/AdminQuiz/CreateQuiz/CreateQuiz";
import CreateSection from "./quiz-components/AdminQuiz/CreateSection/CreateSection";

import CommonLayout from "./login-components/Userlogin/layout/CommonLayout"
import { getCurrentUser } from "./login-components/Userlogin/api/auth";
import Home from "./login-components/Userlogin/pages/Home.tsx";
import SignIn from './login-components/Userlogin/pages/SignIn';
import SignUp  from "./login-components/Userlogin/pages/SignUp";

export const AuthContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
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

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }) => {
    const navigate = useNavigate(); 

    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        navigate("/signin");  
      }
    } else {
      return <></>;
    }
  };
  return (
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
          <Route path="/" element={<Private><Home /></Private>} />

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
