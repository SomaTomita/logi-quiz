import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import clientRaw from "../quizApi/clientRaw";
import SectionDisplay from "./sectionDisplay";

function Section() {
  const [sections, setSections] = useState([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSections = async () => {
      const response = await clientRaw.get("/sections");
      setSections(response.data);
      setLoading(false);
    };
    fetchSections();
  }, []);
  

  function handleSectionClick(sectionId) {
    navigate(`/sections/${sectionId}/quizzes`);
  }

  return (
    <SectionDisplay
      sections={sections}
      handleSectionClick={handleSectionClick}
      navigate={navigate}
      loading={loading}
    />
  );
}

export default Section;
