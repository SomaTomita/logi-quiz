import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Section() {
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await axios.get('http://localhost:3000/sections');
      setSections(response.data);
    }
    fetchSections();
  }, []);

  function handleSectionClick(sectionId) {
    navigate(`/sections/${sectionId}/quizzes`);
  }

  return (
      <table>
          <tbody>
              {sections.map(section => (
                  <tr key={section.id} onClick={() => handleSectionClick(section.id)}>
                      <td>{section.section_name}</td>
                  </tr>
              ))}
          </tbody>
      </table>
  );
}

export default Section;