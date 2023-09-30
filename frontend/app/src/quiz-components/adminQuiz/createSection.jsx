import { useState } from "react";
import clientRaw from "../quizApi/clientRaw";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import { TextField, Button, Grid, Typography, Fab, Paper } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";


function CreateSection() {
  const [sectionName, setSectionName] = useState("");

  const handleInputChange = (event) => {
    setSectionName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await clientRaw.post(
      `/admin/sections`,
      { section_name: sectionName },
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
  };


  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ marginBottom: 5 }}>Create New Section</Typography>

      <Paper elevation={3} sx={{ maxWidth: 450, padding: 3, marginTop: 2, marginBottom: 3,}} >
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="section_name"
              placeholder="セクション名を入力してください"
              variant="outlined"
              value={sectionName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: 2, marginBottom: 2, textTransform: "none" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: 450, margin: "0 auto" }}
      >
        <Grid item xs={12}>
          <Fab
            variant="extended"
            component={Link}
            to="/edit-section"
            color="primary"
            sx={{ marginTop: 4, marginBottom: 2, textTransform: "none" }}
          >
            <EditNoteIcon sx={{ mr: 1 }} />
            Edit Section
          </Fab>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateSection;
