import { Grid, Typography, Fab, Paper } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import { styled } from '@mui/system';


const StyledPaper = styled(Paper)(({ theme }) => ({
    fontSize: '16px',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#D3D3D3',
    cursor: 'pointer',
    width: '70%',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover': { 
      backgroundColor: '#1976d2',
      color: '#ffffff',
    },
    '& p': {
      margin: 0,
    },
  }));

  
function SectionDisplay({ sections, handleSectionClick, navigate }) {
  return (
    <div className="section-wrapper" style={{ marginBottom: '80px' }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 5 }}>セクション選択</Typography>

      <Grid container spacing={3} className="section-container" sx={{ fontSize: "1.1rem" }}>
        {sections.map(section => (
          <Grid item xs={12} sm={6} md={6} key={section.id} onClick={() => handleSectionClick(section.id)}>
            <StyledPaper elevation={3}>
              <p>{section.section_name}</p>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
      <Fab variant="extended" color="primary" sx={{ position: 'fixed', bottom: '24px', right: '24px' }}
        onClick={() => navigate("/home")}
      >
        <NavigationIcon sx={{ mr: 1, textTransform: "none", }} />Home
      </Fab>
    </div>
  );
}

export default SectionDisplay;