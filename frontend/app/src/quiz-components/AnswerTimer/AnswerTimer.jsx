import "./answerTimer.css";
import { useEffect, useState, useRef } from "react";


function AnswerTimer({ duration, onTimeUp }) {
  const [counter, setCounter] = useState(0); // タイマーのカウントアップを追跡
  const [progressLoaded, setProgressLoaded] = useState(0); // 進捗バーのロード状態
  const intervalRef = useRef();  // 再レンダリング時にその変数がリセットされない

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCounter((prev) => prev + 0.1);
    }, 100); // setInterval関数で100ミリ秒ごとに0.1を増やす

    return () => clearInterval(intervalRef.current); // アンマウントされるときにsetIntervalを停止(引数=停止したいタイマー)
  }, []);


  useEffect(() => {
    setProgressLoaded(100 * (counter / duration));
  
    // カウンターがdurationに達した場合、タイマーを停止してonTimeUpを呼び出す
    if (counter >= duration) {
      clearInterval(intervalRef.current);
  
      setTimeout(() => {
        onTimeUp();
      }, 100);
    }
  }, [counter]); // counterが変更されるたびに実行
  

  const progressBarStyle = {
    width: `${progressLoaded}%`,
    // counterがduration - 2以上になった時(残り時間が2秒を切ったときに)バーが赤に変更
    backgroundColor: counter >= duration - 2 ? "red" : "#2d264b"
  };

  return (
    <div className="answer-loader-container">
      <div style={progressBarStyle} className="progress"></div>
    </div>
  );
}

export default AnswerTimer;
