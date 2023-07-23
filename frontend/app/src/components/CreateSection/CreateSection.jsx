import { useState } from 'react';
import axios from 'axios';

function CreateSection() {
  const [sectionName, setSectionName] = useState("");

  const handleInputChange = (event) => {
    setSectionName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`http://localhost:3001/sections`, { section_name: sectionName });
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="section_name" placeholder="セクション名を入力してください" onChange={handleInputChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateSection;
