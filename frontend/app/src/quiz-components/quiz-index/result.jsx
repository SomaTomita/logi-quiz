import { Box, Typography, Paper, Button } from "@mui/material";

const Result = ({ questions, correctAnswersIndex, onTryAgain, backToSections }) => {
  return (
    <Box sx={{ borderRadius: 4 }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ marginBottom: 4, borderRadius: 4 }}>
        正答数 :{" "}
        <Typography component="span" color="#150080" fontSize="32px">
          {correctAnswersIndex.length}/{questions.length}
        </Typography>
      </Typography>
      {questions.map((questionItem, index) => {
        const {
          question_text: reviewQuestion,
          choices: reviewChoices,
          explanation: { explanation_text: reviewExplanation },
        } = questionItem;
        const reviewCorrectAnswer =
          reviewChoices.find((choice) => choice.is_correct)?.choice_text || "";
        return (
          <Paper elevation={5} key={index}
            sx={{ backgroundColor: "#D3D3D3", p: "20px 0", mb: 2, maxWidth: 450, }}>
            <Typography gutterBottom sx={{ margin: 2 }}>
              問題: {reviewQuestion}
            </Typography>
            <Typography gutterBottom sx={{ margin: 2 }}>
              正解: {reviewCorrectAnswer}{" "}
            </Typography>
            <Typography gutterBottom sx={{ margin: 2 }}>
              あなたの回答: {correctAnswersIndex.includes(index) ? "⭕️" : "❌"}{" "}
            </Typography>
            <Typography gutterBottom sx={{ margin: 2 }}>
              解説: {reviewExplanation}
            </Typography>
          </Paper>
        );
      })}
      <Box mt={2} textAlign="center">
        <Button variant="contained" size="large" onClick={onTryAgain} sx={{ mr: 1, textTransform: "none", marginTop: 3 }}>
          Try again
        </Button>
        <Button variant="contained" size="large" onClick={backToSections} sx={{ textTransform: "none", marginTop: 3 }}>
          Back to Sections
        </Button>
      </Box>
    </Box>
  );
};

export default Result;
