import { useState, useEffect } from "react";
import clientRaw from "../quizApi/clientRaw";
import Cookies from "js-cookie";
import Loading from '../../layout/loading';

import { Typography, Grid, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";
import { styled } from "@mui/system";


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

const EditButtonStyle = styled(Button)({
  margin: "5px",
  borderColor: "black",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "#ffffff",
  },
  color: "black",
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    padding: "6px 0",
  },
});


function EditSection() {
  const [sections, setSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [updatedSectionName, setUpdatedSectionName] = useState("");
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false); // 確認ダイアログの表示状態
  const [sectionIdToDelete, setSectionIdToDelete] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await clientRaw.get("/sections");
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  
  const handleEditClick = (sectionId, sectionName) => {
    setEditingSectionId(sectionId);
    setUpdatedSectionName(sectionName);
  };

  const handleCancelClick = () => {
    setEditingSectionId(null);
  };

  const handleSaveClick = async (sectionId) => {
    try {
      await clientRaw.put(`/admin/sections/${sectionId}`, 
       {
        section: {
         section_name: updatedSectionName,
        },
       },
       {
         headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
         },
        }
      );

      // セクションリストを更新
    const updatedSections = sections.map((section) =>
      section.id === sectionId
         ? { ...section, section_name: updatedSectionName }
         : section
      );
      setSections(updatedSections);
      setEditingSectionId(null);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleDeleteClick = async (sectionId) => {
    try {
      await clientRaw.delete(`/admin/sections/${sectionId}`, {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      });
      // セクションリストから削除したセクションを除外
      const remainingSections = sections.filter(
        (section) => section.id !== sectionId
      );
      setSections(remainingSections);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const openDeleteDialog = (sectionId) => {
    setSectionIdToDelete(sectionId);
    setConfirmDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSectionIdToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (sectionIdToDelete) {
      handleDeleteClick(sectionIdToDelete);
    }
    closeDeleteDialog();
  };

  if (loading) return <Loading />;
  
  
  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 5 }}>Edit Section</Typography>

      <Grid container spacing={3} className="section-container">
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <StyledPaper elevation={3}>
              {editingSectionId === section.id ? (
                <>
                  <StyledTextField
                    value={updatedSectionName}
                    onChange={(e) => setUpdatedSectionName(e.target.value)}
                  />
                  <div>
                    <EditButtonStyle onClick={handleCancelClick} variant="outlined" sx={{ margin: 1, textTransform: "none" }}>
                      Cancel
                    </EditButtonStyle>
                    <EditButtonStyle onClick={() => handleSaveClick(section.id)} variant="outlined" sx={{ margin: 1, textTransform: "none" }}>
                      Save
                    </EditButtonStyle>
                  </div>
                </>
              ) : (
                <>
                  <p>{section.section_name}</p>
                  <StyledButton variant="outlined" 
                  onClick={() =>handleEditClick(section.id, section.section_name)}
                    sx={{ textTransform: "none" }}>
                    Edit
                  </StyledButton>
                  <StyledButton variant="outlined"
                    onClick={() => openDeleteDialog(section.id)}
                    sx={{ textTransform: "none" }}>
                    Delete
                  </StyledButton>
                </>
              )}
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={confirmDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this section?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary" sx={{ textTransform: "none" }}>
            No
          </Button>
          <Button onClick={confirmDelete} color="primary" sx={{ textTransform: "none" }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditSection;