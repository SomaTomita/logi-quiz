import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import clientRaw from "../quizApi/clientRaw";
import Cookies from "js-cookie";
import Loading from "../../layout/loading"

import { TextField, Button, FormControlLabel, Checkbox, Box } from "@mui/material";


function UpdateQuiz() {
  const { sectionId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await clientRaw.get(
          `/admin/sections/${sectionId}/quizzes/${quizId}`,
          {
            headers: {
              "access-token": Cookies.get("_access_token"),
              client: Cookies.get("_client"),
              uid: Cookies.get("_uid"),
            },
          }
        );
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuizData();
  }, [sectionId, quizId]);

  if (!quiz) return <Loading />;


  const saveChanges = async () => {
    try {
      const updatedQuizData = {
        ...quiz,
        choices_attributes: quiz.choices,
        explanation_attributes: quiz.explanation,
      };

      await clientRaw.put(
        `/admin/sections/${sectionId}/quizzes/${quizId}`,
        { quiz: updatedQuizData },
        {
          headers: {
            "access-token": Cookies.get("_access_token"),
            client: Cookies.get("_client"),
            uid: Cookies.get("_uid"),
          },
        }
      );
      alert("Changes saved successfully!");
      navigate("/edit-quiz");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };


  return (
    <div>
      <TextField label="Question Text" variant="outlined" fullWidth
        value={quiz.question_text}
        onChange={(e) => setQuiz({ ...quiz, question_text: e.target.value })}
        sx={{ marginTop: 2 }}
      />

      {(quiz.choices || []).map((choice, index) => (
        <Box key={index} display="flex" alignItems="center" sx={{ marginTop: 2 }}>
          <TextField label={`Choice ${index + 1}`} variant="outlined"
            value={choice.choice_text}
            onChange={(e) => {
              const updatedChoices = [...quiz.choices];
              updatedChoices[index].choice_text = e.target.value;
              setQuiz({ ...quiz, choices_attributes: updatedChoices });
            }}
            sx={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={choice.is_correct}
                onChange={() => {
                  const updatedChoices = [...quiz.choices];
                  updatedChoices[index].is_correct = !choice.is_correct;
                  setQuiz({ ...quiz, choices: updatedChoices });
                }}
              />
            }
            label="Is Correct"
            sx={{ marginLeft: 2 }}
          />
        </Box>
      ))}

      <TextField label="Explanation" variant="outlined" fullWidth multiline
        value={quiz.explanation ? quiz.explanation.explanation_text : ""}
        onChange={(e) => {
          const updatedExplanation = {
            ...quiz.explanation, explanation_text: e.target.value, };
          setQuiz({ ...quiz, explanation: updatedExplanation });
        }}
        sx={{ marginTop: 2 }}
      />

      <Button variant="contained" color="primary" onClick={saveChanges}
        sx={{ marginTop: 2, marginBottom: 2, textTransform: "none" }}
      >
        Save Changes
      </Button>

      <Button variant="outlined" color="primary" onClick={() => navigate("/edit-quiz")}
        sx={{ marginTop: 2, marginBottom: 2, marginLeft: 2, textTransform: "none" }}>
        Cancel
      </Button>
    </div>
  );
}

export default UpdateQuiz;
