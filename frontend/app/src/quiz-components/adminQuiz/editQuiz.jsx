import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientRaw from "../quizApi/clientRaw";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import Cookies from "js-cookie";

const StyledPaper = styled(Paper)(({ theme }) => ({
  fontSize: "16px",
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#D3D3D3",
  "& p": {
    margin: 0,
  },
}));

const StyledButton = styled(Button)({
  margin: "5px",
  borderColor: "black",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "#ffffff",
  },
  color: "black",
});

function EditQuiz() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await clientRaw.get("/sections");
      setSections(response.data);
    };
    fetchSections();
  }, []);

  const handleSectionClick = async (sectionId) => {
    try {
        const response = await clientRaw.get(`/admin/sections/${sectionId}/quizzes`, {
            headers: {
                "access-token": Cookies.get("_access_token"),
                client: Cookies.get("_client"),
                uid: Cookies.get("_uid"),
            }
        });
        setQuizzes(response.data);
        setSelectedSection(sectionId);
    }  catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const openDeleteDialog = (quizId) => {
    setQuizIdToDelete(quizId);
    setConfirmDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setQuizIdToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (quizIdToDelete) {
      try {
        await clientRaw.delete(`/admin/sections/${selectedSection}/quizzes/${quizIdToDelete}`, {
          headers: {
            "access-token": Cookies.get("_access_token"),
            client: Cookies.get("_client"),
            uid: Cookies.get("_uid"),
          },
        });
        const remainingQuizzes = quizzes.filter(
          (quiz) => quiz.id !== quizIdToDelete
        );
        setQuizzes(remainingQuizzes);
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
    closeDeleteDialog();
  };

  return (
    <>
      <Typography variant="h5">Select a section</Typography>
      <div>
        {sections.map((section) => (
          <StyledButton
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            sx={{ marginTop: 2 }}
          >
            {section.section_name}
          </StyledButton>
        ))}
      </div>
      {selectedSection && (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <StyledPaper elevation={3}>
                <p>{quiz.question_text}</p>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate(`/update-quiz/${selectedSection}/${quiz.id}`)}
                  sx={{ textTransform: "none" }}
                >
                  Edit
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => openDeleteDialog(quiz.id)}
                  sx={{ textTransform: "none" }}
                >
                  Delete
                </StyledButton>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={confirmDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteDialog}
            color="primary"
            sx={{ textTransform: "none" }}
          >
            No
          </Button>
          <Button
            onClick={confirmDelete}
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditQuiz;
