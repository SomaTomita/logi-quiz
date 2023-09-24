import { Box, Typography, Button, Fab } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";

const StartQuiz = ({ onStart, navigate }) => {
    return (
        <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Are you ready?
        </Typography>
        <Button variant="contained" size="large"
          onClick={onStart}
          sx={{ padding: '1rem 2.5rem', textDecoration: "none", marginTop: 4, textTransform: "none", fontSize: '1.1rem', }}>
          Start
        </Button>
        <Fab variant="extended" color="primary" sx={{ position: 'fixed', bottom: '24px', right: '24px' }}
          onClick={() => navigate("/home")}>
         <NavigationIcon sx={{ mr: 1, textTransform: "none", }} />Home
         </Fab>
      </Box>
    );
}

export default StartQuiz;
