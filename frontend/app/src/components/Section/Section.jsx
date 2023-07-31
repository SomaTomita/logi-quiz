import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Section.css';

function Section() {
  const [sections, setSections] = useState([]); // セクションデータ格納
  const navigate = useNavigate(); // 画面遷移を制御するためのnavigate関数を定義

  useEffect(() => {
    // APIからセクションデータを取得する処理が終了するまで次の行(response)には進まない
    const fetchSections = async () => {
      const response = await axios.get('http://localhost:3001/sections');
      setSections(response.data);
    }
    fetchSections(); // 非同期関数の呼び出し
  }, []); // 依存配列が空 = コンポーネントが初めて描画された直後（マウント時）に1回だけ実行

  
  function handleSectionClick(sectionId) {   // クリックされた特定のセクション(引数:sectionId)に画面遷移を行う関数を定義
    navigate(`/sections/${sectionId}/quizzes`);
  }

  return (
    <div className="section-container">
      {/* 引数sectionに渡ってきた各セクションオブジェクトのsection_nameプロパティを参照 */}
      {sections.map(section => (
        <div key={section.id} className="section-block" onClick={() => handleSectionClick(section.id)}>
          <p>{section.section_name}</p>
        </div>
      ))}
    </div>
  );
}

export default Section;