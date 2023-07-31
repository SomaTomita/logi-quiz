import { useState } from 'react';
import axios from 'axios';

function CreateSection() {
  // 初期値を空文字列に設定。入力されたセクション名を更新するための関数
  const [sectionName, setSectionName] = useState("");

  const handleInputChange = (event) => {
    setSectionName(event.target.value);  // event.target.valueでinput要素の現在の値をsetSectionNameにて更新
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
    // サーバーへsection_nameとして、リアルタイムで更新されるsectionNameの値を送信
    const response = await axios.post(`http://localhost:3001/sections`, { section_name: sectionName });
    console.log(response.data); // レスポンスデータをコンソールに出力
  };

  return (
    // フォームが送信されたときにhandleSubmit関数、inputの値が変わればhandleInputChange関数を呼び出すよう設定
    <form onSubmit={handleSubmit}>
      <input type="text" name="section_name" placeholder="セクション名を入力してください" onChange={handleInputChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateSection;
