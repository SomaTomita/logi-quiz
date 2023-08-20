import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientRaw from "../clientRaw";
import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import Cookies from "js-cookie";

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

  if (!quiz) return <div>Loading...</div>;

  const saveChanges = async () => {
    try {
      await clientRaw.put(
        `/admin/sections/${sectionId}/quizzes/${quizId}`,
        quiz,
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
      <TextField
        label="Question Text"
        variant="outlined"
        fullWidth
        value={quiz.question_text}
        onChange={(e) => setQuiz({ ...quiz, question_text: e.target.value })}
      />

      {(quiz.choices || []).map((choice, index) => (
        <div key={index}>
          <TextField
            label={`Choice ${index + 1}`}
            variant="outlined"
            fullWidth
            value={choice.choice_text}
            onChange={(e) => {
              const updatedChoices = [...quiz.choices];
              updatedChoices[index].choice_text = e.target.value;
              setQuiz({ ...quiz, choices: updatedChoices });
            }}
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
          />
        </div>
      ))}

      <TextField
        label="Explanation"
        variant="outlined"
        fullWidth
        multiline
        value={quiz.explanation ? quiz.explanation.explanation_text : ""}
        onChange={(e) => {
          const updatedExplanation = { ...quiz.explanation, explanation_text: e.target.value };
          setQuiz({ ...quiz, explanation: updatedExplanation });
        }}
      />

      <Button variant="contained" color="primary" onClick={saveChanges}>
        Save Changes
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/edit-quiz")}
      >
        Cancel
      </Button>
    </div>
  );
}

export default UpdateQuiz;