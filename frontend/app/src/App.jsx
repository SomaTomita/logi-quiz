
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./components/Quiz/Quiz";
import Section from "./components/Section/Section";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import CreateSection from "./components/CreateSection/CreateSection";

function App() {
    return (
<Router>
  <Routes>
   <Route path="/create-quiz" element={<CreateQuiz/>} /> 
   <Route path="/create-section" element={<CreateSection/>} /> 
   <Route path="/sections" element={<Section />} /> 
   <Route path="/sections/:sectionId/quizzes" element={<Quiz />} />
  </Routes>
</Router>
    );
}


export default App;
