import { useState } from "react";
import clientRaw from '../clientRaw';
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Typography, Fab, Paper } from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';

function CreateSection() {
  // 初期値を空文字列に設定。入力されたセクション名を更新するための関数
  const [sectionName, setSectionName] = useState("");

  const handleInputChange = (event) => {
    setSectionName(event.target.value); // event.target.valueでinput要素の現在の値をsetSectionNameにて更新
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
    // サーバーへsection_nameとして、リアルタイムで更新されるsectionNameの値を送信
    const response = await clientRaw.post(`/admin/sections`, {section_name: sectionName}, {
      headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
      },
  });
    console.log(response.data);
  };

  return (
    // フォームが送信されたときにhandleSubmit関数、inputの値が変わればhandleInputChange関数を呼び出すよう設定
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Add Section</Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2, marginBottom: 3 }}>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <TextField
            type="text"
            name="section_name"
            placeholder="セクション名を入力してください"
            variant="outlined"
            value={sectionName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2}}>
          <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2, marginBottom: 2, textTransform: "none" }}>
            Submit
          </Button>
          </Grid>
          </Grid>
          </Paper>

          <Grid container justifyContent="center" alignItems="center">
           <Grid item xs={12}>
          <Fab variant="extended" component={Link} to="/edit-section" color="primary" sx={{ marginTop: 4, marginBottom: 2, textTransform: "none" }}>
            <EditNoteIcon sx={{ mr: 1 }} />
            Edit Section
          </Fab>
          </Grid>
         </Grid>
    </form>
  );
}

export default CreateSection;
