import { Typography, ButtonBase, ListItem, Box, Button } from "@mui/material";


const QuizBody = ({
  showAnswerTimer,
  currentQuestion,
  questions,
  question,
  choices,
  answer,
  onAnswerClick,
  answerIndex,
  onClickNext,
  Answertimer,
  handleTimeUp
}) => {
  return (
    <Box>
      {showAnswerTimer && (
        <Answertimer key={currentQuestion} duration={15} onTimeUp={handleTimeUp} />
      )}
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 3 }}>
        <Box component="span" fontWeight="500">
          {currentQuestion + 1}
        </Box>
        /
        <Box component="span" fontWeight="500">
          {questions.length}
        </Box>
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 3 }}>
        {question}
      </Typography>
      <Box component="ul" pl={0} mt={2}>
        {choices.map((choice, index) => (
          <ButtonBase
            onClick={() => onAnswerClick(choice, index)}
            sx={{ width: "100%", borderRadius: 1, mb: 1 }}
            key={choice.choice_text}
          >
            <ListItem
              sx={{
                width: "100%",
                textAlign: "left",
                background: answerIndex === index ? "#1976d2" : "#ffffff",
                color: answerIndex === index ? "#FFFFFF" : "#2d264b",
                fontSize: "18px",
                padding: "12px 24px",
                border: "1px solid #d0d0d0",
                "&:hover": {
                  background: "#e0e0e0",
                  cursor: "pointer",
                }
              }}
            >
              {choice.choice_text}
            </ListItem>
          </ButtonBase>
        ))}
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end" sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => onClickNext(answer)}
          disabled={answerIndex === null}
          sx={{ textTransform: "none", marginTop: 2 }}
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default QuizBody;
