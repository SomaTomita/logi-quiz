import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./quiz-components/Quiz/Quiz";
import Section from "./quiz-components/Section/Section";
import CreateQuiz from "./quiz-components/CreateQuiz/CreateQuiz";
import CreateSection from "./quiz-components/CreateSection/CreateSection";
import Login from "./login-componets/UserLogin/Login";
import UserLogin from "./login-componets/UserLogin/UserLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login-create" element={<Login />} />
        <Route path="/login-user" element={<UserLogin/>} /> 
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/create-section" element={<CreateSection />} />
        <Route path="/sections" element={<Section />} />
        <Route path="/sections/:sectionId/quizzes" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
