import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import clientRaw from "../quizApi/clientRaw"
import SectionDisplay from './sectionDisplay';


function Section() {
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await clientRaw.get('/sections');
      setSections(response.data);
    }
    fetchSections();
  }, []);

  
  function handleSectionClick(sectionId) {
    navigate(`/sections/${sectionId}/quizzes`);
  }

  
  return <SectionDisplay sections={sections} handleSectionClick={handleSectionClick} navigate={navigate} />;
}

export default Section;