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

  const [sections, setSections] = useState([]); 
  const [selectedSection, setSelectedSection] = useState("");

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

  const handleInputChange = (event, index) => {
    const { name, value, type, checked } = event.target;  // 下記returnの変更イベントからname, value, type, checkedを取得
    const actualValue = type === "checkbox" ? checked : value;  // checkboxの場合はcheckedの値を、それ以外の場合はvalueをactualValueとする
    const list = [...quizData.choices_attributes];  // 現在のchoices_attributes(問題の選択肢を保持する配列)の内容をコピーしてlistに格納
    list[index][name] = actualValue;  // 選択肢の該当するindexの部分を更新
    setQuizData({ ...quizData, choices_attributes: list });  // quizDataを更新し、choices_attributesだけを変更
  };

  const handleQuestionChange = (event) => { // スプレッド演算子
    setQuizData({ ...quizData, question_text: event.target.value });
  };

  const handleExplanationChange = (event) => {
    setQuizData({ ...quizData, explanation_text: event.target.value });
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // デフォルト設定のページリロードを停止
    const sectionId = selectedSection;  // 現在選ばれているセクションをsectionIdに格納
    const response = await axios.post(`http://localhost:3001/sections/${sectionId}/quizzes`, quizData);
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
          <div id='choice_text_label' key={index}>
           <input type="text" name="choice_text" value={choice.choice_text} placeholder="選択肢を入力してください" onChange={e => handleInputChange(e, index)} />
           <input type="checkbox" name="is_correct" checked={choice.is_correct} onChange={e => handleInputChange(e, index)} />正解
          </div>
        ))}

        <label htmlFor="explanation_text_label">解説:</label>
        <textarea id='explanation_text_label' type="text" name="explanation_text" placeholder="解説を入力してください" onChange={handleExplanationChange} />

        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default CreateQuiz;
