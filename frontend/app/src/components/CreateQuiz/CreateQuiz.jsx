import { useState, useEffect } from 'react';
import axios from 'axios';
import "./CreateQuiz.css";

function CreateQuiz() {
  const [quizData, setQuizData] = useState({
    question_text: "",
    choices_attributes: [
      { choice_text: "", is_correct: false },
      { choice_text: "", is_correct: false },
      { choice_text: "", is_correct: false },
      { choice_text: "", is_correct: false },
    ],
    explanation_text: "", 
  });

  const [sections, setSections] = useState([]);  // ユーザーに表示するセクションの選択肢
  const [selectedSection, setSelectedSection] = useState(""); // ユーザーが選択した特定のセクションを保持

  useEffect(() => {
    axios.get('http://localhost:3001/sections')
      .then(response => {  // セクションデータを取得後then以降が実行
        console.log("Sections Data: ", response.data);
        setSections(response.data);  // ユーザーに表示するセクションの選択肢 (下記selectより)
        if (response.data && response.data.length > 0) { // 指定したセクションにデータがあれば以下を実行
          setSelectedSection(response.data[0].id);
          console.log("Initial Section ID: ", response.data[0].id);  // 初期値として設定したセクションIDをログに出力
        }
      })
      .catch(error => {  // Promiseでエラーが出た時
        console.error('There was an error!', error);
      });
  }, []);

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleQuestionChange = (event) => { // スプレッド演算子と変更したいオブジェクトの値で、特定のプロパティのみを更新
    setQuizData({ ...quizData, question_text: event.target.value });
  };

  const handleInputChange = (event, index) => { 
    const { name, value, type, checked } = event.target;  // ユーザーから入力されたeventの変更イベントからname(どのプロパティか), value(4つのどの選択肢か), type(テキストかチェックか), checked(ture or false)を取得

    const actualValue = type === "checkbox" ? checked : value;  // typeがcheckboxであれば真偽値、checkboxでなければ文字列の値
    const list = [...quizData.choices_attributes];  // 4つの選択肢（choice_text: "", is_correct: false）をlistに格納
    list[index][name] = actualValue;  // (引数indexより渡る)4つの選択肢におけるどの配列番号の、どのプロパティかを指定して更新
    
    setQuizData({ ...quizData, choices_attributes: list });
  };

  const handleExplanationChange = (event) => {
    setQuizData({ ...quizData, explanation_text: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // デフォルト設定のページリロードを停止
    const sectionId = selectedSection;  // 現在選ばれているセクションをsectionIdに格納
    const response = await axios.post(`http://localhost:3001/sections/${sectionId}/quizzes`, quizData); // setQuizDataを通じてフォームに入力されたクイズの情報(quizData オブジェクト)をサーバーへ送信
    console.log(response.data);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="section_label">セクション：</label>
           {/* ドロップダウンメニューからセクションを選択するとselectedSectionを更新 */}
        <select id="section_label" value={selectedSection} onChange={handleSectionChange}>
          {sections.map(section => (
           <option key={section.id} value={section.id}>{section.section_name}</option>
        ))}
        </select>

        <br />
        <label htmlFor="question_text_label">問題文:</label>
        <textarea id="question_text_label" type="text" name="question_text" placeholder="問題文を入力してください" onChange={handleQuestionChange} />
        <br />

        <label htmlFor="choice_text_label">選択肢:</label>
        {quizData.choices_attributes.map((choice, index) => (
          <div id="choice_text_label" key={index}> 
           <input type="text" name="choice_text" value={choice.choice_text} placeholder="選択肢を入力してください" onChange={event => handleInputChange(event, index)} />
           <input type="checkbox" name="is_correct" checked={choice.is_correct} onChange={event => handleInputChange(event, index)} />正解
          </div>
        ))}

        <label htmlFor="explanation_text_label">解説:</label>
        <textarea id='explanation_text_label' type="text" name="explanation_text" placeholder="解説を入力してください" onChange={handleExplanationChange} />

        <br />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default CreateQuiz;
