import { useState, useEffect } from 'react';
import axios from 'axios';

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
      .then(response => {
        console.log("Sections Data: ", response.data);  // APIから取得したセクションのデータをログに出力
        setSections(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedSection(response.data[0].id);
          console.log("Initial Section ID: ", response.data[0].id);  // 初期値として設定したセクションIDをログに出力
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleInputChange = (event, index) => {
    const { name, value, type, checked } = event.target;
    const actualValue = type === "checkbox" ? checked : value;
    const list = [...quizData.choices_attributes];
    list[index][name] = actualValue;
    setQuizData({ ...quizData, choices_attributes: list });
  };

  const handleQuestionChange = (event) => {
    setQuizData({ ...quizData, question_text: event.target.value });
  };

  const handleExplanationChange = (event) => {
    setQuizData({ ...quizData, explanation_text: event.target.value });
  };

  const handleSectionChange = (event) => {  // 選択したセクションのidをセット
    setSelectedSection(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sectionId = selectedSection;  // 選択したセクションのidを使用
    const response = await axios.post(`http://localhost:3001/sections/${sectionId}/quizzes`, quizData);
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedSection} onChange={handleSectionChange}> {/* セクションのプルダウン */}
        {sections.map(section => (
          <option key={section.id} value={section.id}>{section.section_name}</option>
        ))}
      </select>

      <input type="text" name="question_text" placeholder="問題文を入力してください" onChange={handleQuestionChange} />

      {quizData.choices_attributes.map((choice, index) => (
        <div key={index}>
          <input type="text" name="choice_text" value={choice.choice_text} placeholder="選択肢を入力してください" onChange={e => handleInputChange(e, index)} />
          <input type="checkbox" name="is_correct" checked={choice.is_correct} onChange={e => handleInputChange(e, index)} />正解
        </div>
      ))}

      <input type="text" name="explanation_text" placeholder="解説を入力してください" onChange={handleExplanationChange} />

      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateQuiz;
