import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Answertimer from "../answerTimer/answerTimer";
import "./quiz.css";
import clientRaw from "../quizApi/clientRaw"
import { saveDashboardData } from "../quizApi/dashBoardApi"
import { AuthContext } from "App";

import { Oval } from 'react-loader-spinner';
import Button from "@mui/material/Button";
import { Paper } from "@mui/material"


const Quiz = () => {
  const { sectionId } = useParams();  // URLからsectionIdを取得
  const { currentUser } = useContext(AuthContext);  // ユーザー情報を取得

  const [questions, setQuestions] = useState([]);  // 問題データを格納する配列
  const [currentQuestion, setCurrentQuestion] = useState(0);  // 上の配列questionsの中から現在アクティブな質問を参照するためのインデックスまたはキー
  const [answerIndex, setAnswerIndex] = useState(null);  // 選択した回答が4つ中どれか
  const [answer, setAnswer] = useState(null);  // 答えが正しいかどうかの真偽値
  const [showResult, setShowResult] = useState(false);  // 結果画面を表示するかどうかの真偽値
  const [quizStarted, setQuizStarted] = useState(false);  // クイズが開始されたかどうかの真偽値
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);  // 回答タイマーを表示するかどうかの真偽値

  const [question, setQuestion] = useState("");  // 現在の問題のテキスト
  const [choices, setChoices] = useState([]);  // 現在の問題の選択肢
  const [correctAnswer, setCorrectAnswer] = useState("");  // 現在の正解の選択肢のテキスト
  const [correctAnswersIndex, setCorrectAnswersIndex] = useState([]); // 正解した問題のインデックスを保存

  const [totalPlayTime, setTotalPlayTime] = useState(0); //　プレイ時間を管理
  const [sectionClearCount, setSectionClearCount] = useState(0); // クリアしたセクションの数を管理
  

  const navigate = useNavigate();  // ページ遷移のためのフック


  // クイズが開始されてから終了するまでの時間を計測
  useEffect(() => {
   let timer;
   if (quizStarted) {
     timer = setInterval(() => {
       setTotalPlayTime(prevTime => prevTime + 1);
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
        console.error('Error:', error);
      }
    }
    fetchQuizzes();
  }, [sectionId]); // 異なるセクション間で遷移する際には、sectionIdを依存配列に含める

  useEffect(() => {
    if (!questions.length || !questions[currentQuestion]) {
      return; // 上のuseEffectでsetQuestionsによって渡ってきたquestionsのデータが正しく取得されていなければ何もせずに終了
    }
    console.log("Current question data:", questions[currentQuestion]);

    // 現在の問題データから、問題文、選択肢、説明を抽出
    const { question_text, choices } = questions[currentQuestion];
    setQuestion(question_text);  // オプショナルチェイニングでエラー回避
    setChoices(choices || []);
    setCorrectAnswer(choices?.find(choice => choice.is_correct)?.choice_text || '');  // choices配列からis_correctプロパティがtrueである最初の選択肢のchoice_textプロパティ(正解)を取得
}, [currentQuestion, questions]);

// 問題がロード中、またはされていないときの表示
if (!questions.length) {
  return (
    <div className="loading-container">
      <Oval ariaLabel="loading-indicator"
        height={100}
        width={100}
        strokeWidth={5}
        strokeWidthSecondary={1}
        color="blue"
        secondaryColor="white" />
        'Loading...'
    </div>
  );
};


  const onAnswerClick = (choice, index) => {
    setAnswerIndex(index); // 選択肢をクリックしたかを追跡
    if (choice.choice_text === correctAnswer) { // 正解を判別
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer) => { // 次の問題へ行く際
    setAnswerIndex(null);  // 回答選択をリセット
    setShowAnswerTimer(false); // タイマー表示をオフにしてリセット

    if (finalAnswer) { 
      setCorrectAnswersIndex(prevCorrectIndexes => [...prevCorrectIndexes, currentQuestion]);
    };
    
    // 配列のインデックスは0からのため、questions.length -1で最後の問題かどうかをチェック(最後の問題であれば結果を表示)
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      setSectionClearCount(prev => {
        const newCount = prev + 1; // newCountはprevのsectionClearCountよりも1大きい値になる
        UserDashboardData(newCount)});
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
    setCurrentQuestion(0);  // 現在の問題を最初の問題にリセット
    setQuizStarted(true);  // クイズ開始状態をオン
    setShowAnswerTimer(true);  // タイマー表示をオン
    setTotalPlayTime(0); // プレイ時間は0からスタートに(リセット)
  };

const UserDashboardData = async (newCount = sectionClearCount) => { // デフォルト値にすることでもしUserDashboardData関数を引数なしで呼び出した場合、newCountはsectionClearCountの値になる
  const userId = currentUser.id;

  // ユーザーのダッシュボードデータを構築
  const dashboardData = {
    playTime: totalPlayTime, // プレイ時間
    questions_cleared: correctAnswersIndex.length, // 全正解数を足すため、正解数を記録
    sectionResult: {
      sectionId,
      correctAnswers: correctAnswersIndex.length // こちらは各セクションに基づいて正解した数を記録
    },
    learningStack: {
      date: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" の形式の文字列だけを記録
      totalClear: newCount, // newCountは関数の内部でdashboardDataオブジェクトのlearningStack.totalClearプロパティに設定(1日のstudy_timeを記録)
    }
  }
  console.log('Constructed dashboardData:', dashboardData);

  // saveDashboardData関数を使用してデータを保存
  try {
    await saveDashboardData(dashboardData, userId);
    console.log('Dashboard data saved successfully!');
  } catch (error) {
    console.error('Error saving dashboard data:', error);
  }
};

  // タイマーが終了した際
  const handleTimeUp = () => {
    setAnswer(false); // 間違いと認識
    onClickNext(false); // 次の問題へ
  };

  // クイズ再開回答
  const onTryAgain = () => {
    setShowResult(false);  // 結果画面表示をオフ
    setCurrentQuestion(0);  // 現在の問題を最初(配列の0)の問題にリセット
    setAnswerIndex(null);  // 回答選択をリセット
    setQuizStarted(false);  // クイズ開始状態をオフ
    setShowAnswerTimer(false);  // タイマー表示をオフ
    setTotalPlayTime(0); // ダッシュボードに使うプレイ時間のカウントを0から(リセット)
    setCorrectAnswersIndex(null); // 正解インデックスの配列をリセット
    setSectionClearCount(0); // クリアしたセクションの数をリセット (backendのコントローラーでは既存のstudy_timeに足していくので0にしておく)
  };

   // セクション一覧に戻る
  const backToSections = () => {
    navigate('/sections');
  }

  return (
    <div className="quiz-container"> 
      {!quizStarted && !showResult ? (
        // クイズが開始されておらず、結果も表示されていない場合に表示する画面 // startQuiz関数のquizStartedが真になり、クイズスタート
        <div className="quiz-start">
          <h2>Are you ready?</h2>
          <Button variant="contained" onClick={startQuiz} sx={{ margin: 2, textDecoration: "none" }}>Start</Button>
        </div>
      ) : showResult ?
      (
        // onClickNextより最後の問題であれば、showResuletが真になりクイズ結果を表示する画面
        <div className="result"> 
          <h1>正答率:<span>{correctAnswersIndex.length}/{questions.length}</span></h1>
            {questions.map((questionItem, index) => { // 新しく作られた配列questionItemから必要なプロパティを抽出 (explanationはオブジェクトの中からテキストを抽出)
            const { question_text: reviewQuestion, choices: reviewChoices, explanation: {explanation_text: reviewExplanation} } = questionItem;
            const reviewCorrectAnswer = reviewChoices.find(choice => choice.is_correct)?.choice_text || '';
          return (
            <Paper key={index}>
             <div className="reviewItem" key={index}>
              <p>問題: {reviewQuestion}</p>
              <p>正解: {reviewCorrectAnswer}</p>
              <p>あなたの回答:{correctAnswersIndex.includes(index) ? '⭕️' : '✖︎'}</p> 
              <p>解説: {reviewExplanation}</p>
             </div>
            </Paper>
            // includesで特定の配列があるかチェック
          );
          })}
            <div className="result-button">
             <Button variant="contained" onClick={onTryAgain} sx={{ margin: 2, textTransform: "none" }}>Try again</Button>
             <Button variant="contained" onClick={backToSections} sx={{ margin: 2, textTransform: "none" }}>Back to Sections</Button>
            </div>
        </div>
      ) :
      ( // クイズが開始されていて、結果が表示されていない場合、クイズの現在の画面が表示
        <div> 
          {showAnswerTimer && <Answertimer key={currentQuestion} duration={15} onTimeUp={handleTimeUp} />}
          <span className="active-question-no">{currentQuestion + 1}</span><span className="total-question">/{questions.length}</span>
          <h2>{question}</h2>
          <ul>
            {choices.map((choice, index) => (
              <li
                onClick={() => onAnswerClick(choice, index)}
                key={choice.choice_text}
                className={answerIndex === index ? "selected-answer" : null} // 選択された選択肢には "selected-answer" というクラス当てる
              >
                {choice.choice_text}
              </li>
            ))}
          </ul>
          <div className="footer">
            <Button
              variant="contained" 
              onClick={ () => onClickNext(answer)} // 引数には現在の回答
              // 選択肢が選択されていない場合、ボタンは無効化されます。
              disabled={answerIndex === null}>
             {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;