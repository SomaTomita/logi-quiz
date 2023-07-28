import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Section.css';

function Section() {
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await axios.get('http://localhost:3001/sections');
      setSections(response.data);
    }
    fetchSections();
  }, []);

  function handleSectionClick(sectionId) {
    navigate(`/sections/${sectionId}/quizzes`);
  }

  return (
    <div className="section-container">
      {sections.map(section => (
        <div key={section.id} className="section-block" onClick={() => handleSectionClick(section.id)}>
          <p>{section.section_name}</p>
        </div>
      ))}
    </div>
  );
}

export default Section;
