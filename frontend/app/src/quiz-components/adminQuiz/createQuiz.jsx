import { useState, useEffect } from 'react';
import clientRaw from '../quizApi/clientRaw';
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import Loading from '../../layout/loading';

import { TextField, Checkbox, FormControlLabel, Button, MenuItem, Grid, Typography, Fab, Paper } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';


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
    clientRaw.get('/sections')
      .then(response => {
        setSections(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedSection(response.data[0].id);
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
    // ユーザーから入力されたeventの変更イベントからname(どのプロパティか), value(4つのどの選択肢か), type(テキストかチェックか), checked(ture or false)を取得
    const { name, value, type, checked } = event.target;

    const actualValue = type === "checkbox" ? checked : value;  // typeがcheckboxであれば真偽値、checkboxでなければ文字列の値
    const list = [...quizData.choices_attributes];
    list[index][name] = actualValue;  // (引数indexより渡る)4つの選択肢におけるどの配列番号の、どのプロパティかを指定して更新
    
    setQuizData({ ...quizData, choices_attributes: list });
  };

  const handleExplanationChange = (event) => {
    setQuizData({ ...quizData, explanation_text: event.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const sectionId = selectedSection;
    
    try {
    await clientRaw.post(`/admin/sections/${sectionId}/quizzes`, quizData, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  } catch (error) {
    console.error('There was an error posting the data!', error);
    }
  };

  if (sections.length === 0) return <Loading />;


  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ marginBottom: 5 }}>Create New Quiz</Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2, marginBottom: 3 }}>
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
                    sx={{ marginLeft: 2, alignItems: 'center', justifyContent: 'center' }}
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
            <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2, marginBottom: 2, textTransform: "none" }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Fab variant="extended" component={Link} to="/edit-quiz" color="primary" sx={{ marginTop: 4, marginBottom: 2, textTransform: "none" }}>
            <EditNoteIcon sx={{ mr: 1 }} />
            Edit Quiz
          </Fab>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateQuiz;