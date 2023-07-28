import "./AnswerTimer.css";
import { useEffect, useState, useRef } from "react";


function AnswerTimer({ duration, onTimeUp }) {
  const [counter, setCounter] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCounter((cur) => cur + 0.1);
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    setProgressLoaded(100 * (counter / duration));
  
    if (counter >= duration) {
      clearInterval(intervalRef.current);
  
      setTimeout(() => {
        onTimeUp();
      }, 100);
    }
  }, [counter]);
  

  const progressBarStyle = {
    width: `${progressLoaded}%`,
    backgroundColor: counter >= duration - 2 ? "red" : "#2d264b"
  };

  return (
    <div className="answer-loader-container">
      <div style={progressBarStyle} className="progress"></div>
    </div>
  );
}

export default AnswerTimer;
