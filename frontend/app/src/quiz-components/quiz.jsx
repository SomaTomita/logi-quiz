import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Answertimer from "./answerTimer/answerTimer";
import clientRaw from "./quizApi/clientRaw";
import { saveDashboardData } from "./quizApi/dashBoardApi";
import { AuthContext } from "App";

import { Button, Paper, CircularProgress, Card, Typography, ListItem, Box, } from "@mui/material";

const Quiz = () => {
  const { sectionId } = useParams(); // URLからsectionIdを取得
  const { currentUser } = useContext(AuthContext); // ユーザー情報を取得

  const [questions, setQuestions] = useState([]); // 問題データを格納する配列
  const [currentQuestion, setCurrentQuestion] = useState(0); // 上の配列questionsの中から現在アクティブな質問を参照するためのインデックスまたはキー
  const [answerIndex, setAnswerIndex] = useState(null); // 選択した回答が4つ中どれか
  const [answer, setAnswer] = useState(null); // 答えが正しいかどうかの真偽値
  const [showResult, setShowResult] = useState(false); // 結果画面を表示するかどうかの真偽値
  const [quizStarted, setQuizStarted] = useState(false); // クイズが開始されたかどうかの真偽値
  const [showAnswerTimer, setShowAnswerTimer] = useState(true); // 回答タイマーを表示するかどうかの真偽値

  const [question, setQuestion] = useState(""); // 現在の問題のテキスト
  const [choices, setChoices] = useState([]); // 現在の問題の選択肢
  const [correctAnswer, setCorrectAnswer] = useState(""); // 現在の正解の選択肢のテキスト
  const [correctAnswersIndex, setCorrectAnswersIndex] = useState([]); // 正解した問題のインデックスを保存

  const [totalPlayTime, setTotalPlayTime] = useState(0); //　プレイ時間を管理
  const [sectionClearCount, setSectionClearCount] = useState(0); // クリアしたセクションの数を管理

  const navigate = useNavigate(); // ページ遷移のためのフック


  // クイズが開始されてから終了するまでの時間を計測
  useEffect(() => {
    let timer; // スコープ外では使われていないため、再レンダリング時に保持する必要なし
    if (quizStarted) {
      timer = setInterval(() => {
        setTotalPlayTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer); // アンマウント時にタイマーをクリア
  }, [quizStarted]);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await clientRaw.get(`/sections/${sectionId}/quizzes`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchQuizzes();
  }, [sectionId]); // 異なるセクション間で遷移する際には、sectionIdを依存配列に含める

  useEffect(() => {
    if (!questions.length || !questions[currentQuestion]) {
      return; // 上のuseEffectでsetQuestionsによって渡ってきたquestionsのデータが正しく取得されていなければ何もせずに終了
    }
    console.log("Current question data:", questions[currentQuestion]);

    // 現在の問題データから、問題文、選択肢、説明を抽出
    const { question_text, choices } = questions[currentQuestion];
    setQuestion(question_text); // オプショナルチェイニングでエラー回避
    setChoices(choices || []);
    setCorrectAnswer(
      choices?.find((choice) => choice.is_correct)?.choice_text || ""
    ); // choices配列からis_correctプロパティがtrueである最初の選択肢のchoice_textプロパティ(正解)を取得
  }, [currentQuestion, questions]);

  // 問題がロード中、またはされていないときの表示
  if (!questions.length) {
    return (
      <Box  display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading...</Typography>
      </Box>
    );
  }

  
  const onAnswerClick = (choice, index) => {
    setAnswerIndex(index); // 選択肢をクリックしたかを追跡
    if (choice.choice_text === correctAnswer) {
      // 正解を判別
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer) => {
    // 次の問題へ行く際
    setAnswerIndex(null); // 回答選択をリセット
    setShowAnswerTimer(false); // タイマー表示をオフにしてリセット

    if (finalAnswer) {
      setCorrectAnswersIndex((prevCorrectIndexes) => [
        ...prevCorrectIndexes,
        currentQuestion,
      ]);
    }

    // 配列のインデックスは0からのため、questions.length -1で最後の問題かどうかをチェック(最後の問題であれば結果を表示)
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setSectionClearCount((prev) => {
        const newCount = prev + 1; // newCountはprevのsectionClearCountよりも1大きい値になる
        UserDashboardData(newCount);
      });
      setCurrentQuestion(0);
      setShowResult(true);
    }

    // 少し遅延させてからタイマー表示をオン + ダッシュボードに必要なデータのpost
    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };

  // クイズを開始
  const startQuiz = () => {
    setCurrentQuestion(0); // 現在の問題を最初の問題にリセット
    setQuizStarted(true); // クイズ開始状態をオン
    setShowAnswerTimer(true); // タイマー表示をオン
    setTotalPlayTime(0); // プレイ時間は0からスタートに(リセット)
  };

  const UserDashboardData = async (newCount = sectionClearCount) => {
    // デフォルト値にすることでもしUserDashboardData関数を引数なしで呼び出した場合、newCountはsectionClearCountの値になる
    const userId = currentUser.id;

    // ユーザーのダッシュボードデータを構築
    const dashboardData = {
      playTime: totalPlayTime, // プレイ時間
      questions_cleared: correctAnswersIndex.length, // 全正解数を足すため、正解数を記録
      sectionResult: {
        sectionId,
        correctAnswers: correctAnswersIndex.length, // こちらは各セクションに基づいて正解した数を記録
      },
      learningStack: {
        date: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" の形式の文字列だけを記録
        totalClear: newCount, // newCountは関数の内部でdashboardDataオブジェクトのlearningStack.totalClearプロパティに設定(1日のstudy_timeを記録)
      },
    };
    console.log("Constructed dashboardData:", dashboardData);

    // saveDashboardData関数を使用してデータを保存
    try {
      await saveDashboardData(dashboardData, userId);
      console.log("Dashboard data saved successfully!");
    } catch (error) {
      console.error("Error saving dashboard data:", error);
    }
  };

  // タイマーが終了した際
  const handleTimeUp = () => {
    setAnswer(false); // 間違いと認識
    onClickNext(false); // 次の問題へ
  };

  // クイズ再開回答
  const onTryAgain = () => {
    setShowResult(false); // 結果画面表示をオフ
    setCurrentQuestion(0); // 現在の問題を最初(配列の0)の問題にリセット
    setAnswerIndex(null); // 回答選択をリセット
    setQuizStarted(false); // クイズ開始状態をオフ
    setShowAnswerTimer(false); // タイマー表示をオフ
    setTotalPlayTime(0); // ダッシュボードに使うプレイ時間のカウントを0から(リセット)
    setCorrectAnswersIndex([]); // 正解インデックスの配列をリセット
    setSectionClearCount(0); // クリアしたセクションの数をリセット (backendのコントローラーでは既存のstudy_timeに足していくので0にしておく)
  };

  // セクション一覧に戻る
  const backToSections = () => {
    navigate("/sections");
  };


  return (
    <Card
      sx={{ width: 500, borderRadius: 4, mt: 10, p: "30px 60px", marginBottom: 5, boxSizing: "border-box", position: "relative",}}
    >
      {!quizStarted && !showResult ? (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Are you ready?
          </Typography>
          <Button variant="contained" size="large"
            onClick={startQuiz}
            sx={{ textDecoration: "none", marginTop: 3, }}
          >
            Start
          </Button>
        </Box>
      ) : showResult ? (
        <Box sx={{ borderRadius: 4, }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 4, borderRadius: 4, }}>
            正答数:{" "}
            <Typography component="span" color="#150080" fontSize="36px">
              {correctAnswersIndex.length}/{questions.length}
            </Typography>
          </Typography>
          {questions.map((questionItem, index) => {
            const {
              question_text: reviewQuestion,
              choices: reviewChoices,
              explanation: { explanation_text: reviewExplanation },
            } = questionItem;
            const reviewCorrectAnswer = reviewChoices.find((choice) => choice.is_correct)?.choice_text || "";
            return (
              <Paper elevation={5} key={index} sx={{ backgroundColor: '#D3D3D3', p: "20px 0", mb: 2 }}>
                <Typography gutterBottom sx={{ margin: 2 }}>問題: {reviewQuestion}</Typography>
                <Typography gutterBottom sx={{ margin: 2 }}>
                  正解: {reviewCorrectAnswer}
                </Typography>
                <Typography gutterBottom sx={{ margin: 2 }}>
                  あなたの回答:{" "}
                  {correctAnswersIndex.includes(index) ? "⭕️" : "❌"}
                </Typography>
                <Typography gutterBottom sx={{ margin: 2 }}>解説: {reviewExplanation}</Typography>
              </Paper>
            );
          })}
          <Box mt={2} textAlign="center">
            <Button variant="contained" size="large" onClick={onTryAgain} sx={{ mr: 1, textTransform: "none", marginTop: 3 }}>
              Try again
            </Button>
            <Button variant="contained" size="large" onClick={backToSections} sx={{ textTransform: "none", marginTop: 3 }}>
              Back to Sections
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {showAnswerTimer && (
            <Answertimer key={currentQuestion} duration={15} onTimeUp={handleTimeUp}/>
            )}
          <Typography variant="h5" gutterBottom sx={{ marginBottom: 4 }}>
            <Box component="span" fontWeight="500"> {currentQuestion + 1} </Box>
            /
            <Box component="span" fontWeight="500"> {questions.length} </Box>
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ marginBottom: 3 }}>
            {question}
          </Typography>
          <Box component="ul" pl={0} mt={2}>
            {choices.map((choice, index) => (
              <ListItem onClick={() => onAnswerClick(choice, index)} key={choice.choice_text}
                sx={{ background: answerIndex === index ? "#1976d2" : "#ffffff", 
                color: answerIndex === index ? "#FFFFFF" : "#2d264b", 
                mb: 1, borderRadius: 1, fontSize: "18px", padding: "12px 24px", border: "1px solid #d0d0d0",}}
              >
                {choice.choice_text}
              </ListItem>
            ))}
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end" sx={{ marginTop: 4}}>
            <Button variant="contained" size="large"
             onClick={() => onClickNext(answer)} 
             disabled={answerIndex === null} >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default Quiz;
