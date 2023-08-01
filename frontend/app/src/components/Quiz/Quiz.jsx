import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Answertimer from "../AnswerTimer/AnswerTimer";
import "./Quiz.css";
import axios from "axios"

const Quiz = () => {
  const { sectionId } = useParams();  // URLからsectionIdを取得

  const [questions, setQuestions] = useState([]);  // 問題を格納する配列
  const [currentQuestion, setCurrentQuestion] = useState(0);  // 現在の問題のインデックス
  const [answerIndex, setAnswerIndex] = useState(null);  // 選択した回答のインデックス
  const [answer, setAnswer] = useState(null);  // 答えが正しいかどうかの真偽値
  const [showResult, setShowResult] = useState(false);  // 結果を表示するかどうかの真偽値
  const [quizStarted, setQuizStarted] = useState(false);  // クイズが開始されたかどうかの真偽値
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);  // 回答タイマーを表示するかどうかの真偽値
  const [question, setQuestion] = useState("");  // 現在の問題のテキスト
  const [choices, setChoices] = useState([]);  // 現在の問題の選択肢
  const [correctAnswer, setCorrectAnswer] = useState("");  // 正解の選択肢のテキスト
  const [explanation, setExplanation] = useState("");  // 現在の問題の解説

  // 結果のステートの初期値
  const resultInitialState = { score: 0, correctAnswers: 0, wrongAnswers: 0 };
  const [result, setResult] = useState(resultInitialState);  // 結果のステート
  const navigate = useNavigate();  // ページ遷移のためのフック

// クイズデータをフェッチするためのuseEffectフック
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/sections/${sectionId}/quizzes`);
        setQuestions(response.data);
        console.log("Quiz data:", response.data); // これでQuizデータをログに出力
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchQuizzes();
  }, [sectionId]);

  // currentQuestionやquestionsが変更されたときに問題の情報を更新するためのuseEffectフック
  useEffect(() => {
    if (!questions.length || !questions[currentQuestion]) {
      return;
    }

    console.log("Current question data:", questions[currentQuestion]);

    const { question_text, choices, explanation } = questions[currentQuestion];

    setQuestion(question_text);
    setChoices(choices || []);
    setCorrectAnswer(choices?.find(choice => choice.is_correct)?.choice_text || ''); 
    setExplanation(explanation?.explanation_text || '');
}, [currentQuestion, questions]);

// 問題がロード中、またはされていないときの表示
if (!questions.length) {
  return 'Loading...';
}

  // 選択肢がクリックされたときの処理
  const onAnswerClick = (choice, index) => {
    setAnswerIndex(index);
    if (choice.choice_text === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  // 次の問題へ行く時
  const onClickNext = (finalAnswer) => {
    setAnswerIndex(null);  // 回答選択をリセット
    setShowAnswerTimer(false); // タイマー表示をオフ
    // スコアと回答結果を更新。回答が正しかったらスコアを10増やし、正答数を1増やす。
    setResult((prev) =>
      finalAnswer
        ? {
            ...prev,
            score: prev.score + 10,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    // 現在の問題が最後の問題でなければ次の問題へ進む。最後の問題だったら最初の問題に戻し、結果を表示
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
    }

    // 少し遅延させてからタイマー表示をオン
    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };

  // クイズ再開回答
  const onTryAgain = () => {
    setResult(resultInitialState);  // スコアと回答結果をリセット
    setShowResult(false);  // 結果表示をオフ
    setCurrentQuestion(0);  // 現在の問題を最初(配列の0)の問題にリセット
    setAnswerIndex(null);  // 回答選択をリセット
    setQuizStarted(false);  // クイズ開始状態をオフ
    setShowAnswerTimer(false);  // タイマー表示をオフ
  };

  // クイズを開始
  const startQuiz = () => {
    setCurrentQuestion(0);  // 現在の問題を最初の問題にリセット
    setQuizStarted(true);  // クイズ開始状態をオン
    setShowAnswerTimer(true);  // タイマー表示をオン
  };

  // タイマーが終了したときの処理
  const handleTimeUp = () => {
    setAnswer(false);
    onClickNext(false);
  };

   // セクション一覧に戻るための処理
  const backToSections = () => {
    navigate('/sections');
  }

  return (
    <div className="quiz-container"> 
      {!quizStarted && !showResult ? (
        // クイズが開始されていなく、結果も表示されていない場合に表示するスタート画面
        <div className="quiz-start">
          <h2>Are you ready?</h2>
          <button onClick={startQuiz}>Start</button>
        </div>
      ) : showResult ?
      (
        // onClickNextより最後の問題であれば、クイズ結果を表示する画面。各問題とその解答、解説をリストアップして表示する
        <div className="result"> 
          <h3>結果:<span>{result.correctAnswers}/{questions.length}</span></h3>
          {questions.map((questionItem, index) => {
            const { question_text: reviewQuestion, choices: reviewChoices, explanation: { explanation_text: reviewExplanation } = {} } = questionItem;
            const reviewCorrectAnswerChoice = reviewChoices.find(choice => choice.is_correct);
            const reviewCorrectAnswer = reviewCorrectAnswerChoice ? reviewCorrectAnswerChoice.choice_text : '';
            return (
              <div className="reviewItem" key={index}>
                <p>問題: <span>{reviewQuestion}</span></p>
                <p>正解: <span>{reviewCorrectAnswer}</span></p>
                <p>解説: <span>{reviewExplanation}</span></p>
              </div>
            );
          })}
          <button onClick={onTryAgain}>Try again</button>
          <button onClick={backToSections}>Back to Sections</button>
        </div>
      ) :
      ( 
        <>
          {showAnswerTimer && <Answertimer key={currentQuestion} duration={10} onTimeUp={handleTimeUp} />}
          <span className="active-question-no">{currentQuestion + 1}</span>
          <span className="total-question">/{questions.length}</span>
          <h2>{question}</h2>
          <ul>
            {choices.map((choice, index) => (
              <li
                onClick={() => onAnswerClick(choice, index)}
                key={choice.choice_text}
                className={answerIndex === index ? "selected-answer" : null}
              >
                {choice.choice_text}
              </li>
            ))}
          </ul>
          <div className="footer">
            <button 
              onClick={ () => onClickNext(answer)} 
              disabled={answerIndex === null}>
             {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
