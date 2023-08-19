import { useState, useEffect } from 'react';
import clientRaw from '../api/clientRaw';
import Cookies from 'js-cookie';
import { TextField, Checkbox, FormControlLabel, Button, MenuItem, Grid } from '@mui/material';


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
    clientRaw.get('/sections')
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
    
    try {
     const response = await clientRaw.post(`/admin/sections/${sectionId}/quizzes`, quizData, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }); // setQuizDataを通じてフォームに入力されたクイズの情報(quizData オブジェクト)をサーバーへ送信
    console.log(response.data);
  } catch (error) {
    console.error('There was an error posting the data!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="セクション"
            value={selectedSection}
            onChange={handleSectionChange}
            sx={{ marginTop: 2, width: '50%' }}
          >
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.section_name} 
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="問題文"
            placeholder="問題文を入力してください"
            multiline
            onChange={handleQuestionChange}
            sx={{ marginTop: 2, marginBottom: 2, width: '50%' }}
          />
        </Grid>

        {quizData.choices_attributes.map((choice, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              label={`選択肢 ${index + 1}`}
              name="choice_text"
              value={choice.choice_text}
              placeholder="選択肢を入力してください"
              onChange={(event) => handleInputChange(event, index)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={choice.is_correct}
                  onChange={(event) => handleInputChange(event, index)}
                  name="is_correct"
                  sx={{ marginLeft: 2, alignItems:'center', justifyContent:'center'}}
                />
              }
              label="正解"
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <TextField
            label="解説"
            placeholder="解説を入力してください"
            fullWidth
            multiline
            onChange={handleExplanationChange}
            sx={{ marginTop: 2, width: '50%' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2, marginBottom: 2 }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateQuiz;