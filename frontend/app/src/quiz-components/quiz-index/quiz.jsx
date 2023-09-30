import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Answertimer from "./answerTimer/answerTimer";
import clientRaw from "../quizApi/clientRaw";
import { saveDashboardData } from "../quizApi/dashBoardApi";
import { AuthContext } from "App";
import Loading from "../../layout/loading";
import StartQuiz from "./startQuiz";
import Result from "./result";
import QuizBody from "./quizBody";

import { Card, } from "@mui/material";


const Quiz = () => {
  const { sectionId } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]); // 全問題
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);

  const [question, setQuestion] = useState(""); // 現在の問題のテキスト
  const [choices, setChoices] = useState([]);
  const [correctAnswersIndex, setCorrectAnswersIndex] = useState([]); // 正解した問題のインデックスを保存

  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [sectionClearCount, setSectionClearCount] = useState(0);

  const navigate = useNavigate();


  // クイズ開始~終了時間を計測
  useEffect(() => {
    let timer;
    if (quizStarted) {
      timer = setInterval(() => {
        setTotalPlayTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [quizStarted]);


  useEffect(() => {
    if (showResult && currentUser) {
      UserDashboardData();
    }
  }, [correctAnswersIndex, showResult]);


  const fetchQuizzes = async () => {
    try {
      const response = await clientRaw.get(`/sections/${sectionId}/quizzes`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {  
    fetchQuizzes();
  }, [sectionId]);


  useEffect(() => {
    if (!questions.length || !questions[currentQuestion]) return;

    // 現在の問題データから、問題文、選択肢、説明を抽出
    const { question_text, choices } = questions[currentQuestion];
    setQuestion(question_text);
    setChoices(choices || []);
    setCorrectAnswer(choices?.find((choice) => choice.is_correct)?.choice_text || "");
  }, [currentQuestion, questions]);

  if (!questions.length) return <Loading />;


  const onAnswerClick = (choice, index) => {
    setAnswerIndex(index);
    if (choice.choice_text === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };


  const onClickNext = (finalAnswer) => {
    setAnswerIndex(null);
    setShowAnswerTimer(false);

    if (finalAnswer) {
      setCorrectAnswersIndex((prevCorrectIndexes) => [
        ...prevCorrectIndexes,
        currentQuestion,
      ]);
    }

    if (currentQuestion !== questions.length - 1) { // 最後の問題かどうかをチェック
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setSectionClearCount((prev) => {
        const newCount = prev + 1;
        return newCount;
      });
      setShowResult(true);
      setCurrentQuestion(0);
    }


    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };


  const startQuiz = () => {
    setCurrentQuestion(0);
    setQuizStarted(true);
    setShowAnswerTimer(true);
    setTotalPlayTime(0);
  };


  const UserDashboardData = async (newCount = sectionClearCount) => {
    const userId = currentUser.id;

    const dashboardData = {
      playTime: totalPlayTime,
      questions_cleared: correctAnswersIndex.length,
      sectionResult: {
        sectionId,
        correctAnswers: correctAnswersIndex.length,
      },
      learningStack: {
        date: new Date().toISOString().split("T")[0],
        totalClear: newCount,
      },
    };

    try {
      await saveDashboardData(dashboardData, userId);
      console.log("Dashboard data saved successfully!");
    } catch (error) {
      console.error("Error saving dashboard data:", error);
    }
  };


  const handleTimeUp = () => {
    setAnswer(false);
    onClickNext(false);
  };


  const onTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0); // 現在の問題を最初の問題にリセット
    setAnswerIndex(null); // 回答選択をリセット
    setQuizStarted(false);
    setShowAnswerTimer(false);
    setTotalPlayTime(0);
    setCorrectAnswersIndex([]);
    setSectionClearCount(0);
  };

  const backToSections = () => {
    navigate("/sections");
  };


  return (
    <Card
      sx={{ width: 500, borderRadius: 4, mt: 10, p: "30px 60px", marginBottom: 5, boxSizing: "border-box", position: "relative", }}>
      {!quizStarted && !showResult ? (
        <StartQuiz onStart={startQuiz} navigate={navigate} />
      ) : showResult ? (
        <Result 
          questions={questions}
          correctAnswersIndex={correctAnswersIndex}
          onTryAgain={onTryAgain}
          backToSections={backToSections}
        />
      ) : (
        <QuizBody 
          showAnswerTimer={showAnswerTimer}
          currentQuestion={currentQuestion}
          questions={questions}
          question={question}
          choices={choices}
          answer={answer}
          onAnswerClick={onAnswerClick}
          answerIndex={answerIndex}
          onClickNext={onClickNext}
          Answertimer={Answertimer}
          handleTimeUp={handleTimeUp}
        />
      )}
    </Card>
  );
};

export default Quiz;