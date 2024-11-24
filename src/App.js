import './App.css';
import ChampionBox from './component/ChampionBox/ChampionBox';
import ItemBox from './/component/ItemBox/ItemBox'
import TraitBox from './component/TraitBox/TraitBox';
import RecommendDeckBox from './component/RecommendDeckBox/RecommendDeckBox';
import SetChampionBox from './component/SetChampionBox/SetChampionBox';
import ChampionComponent from './component/ChampionComponent/ChampionComponent';
import { useState, useEffect } from 'react';

function App() {
  const [SetChampionBoxList, SettingChampionBoxList] = useState([])

  const [championList, setChampionList] = useState([]);  // 사용자 상태를 관리
  
  useEffect(() => {
    fetch('/TFTchampionData.json')  // '/'는 public 폴더의 루트 경로
      .then((response) => response.json())  // JSON으로 변환
      .then((data) => {
        const relocatedData = [...data].sort((a, b) => {
          return a.name.localeCompare(b.name, 'ko');
        });
        setChampionList(relocatedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 


  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid-item-ChampionBox">
          <ChampionBox championList={championList} setChampionList={setChampionList} SetChampionBoxList={SetChampionBoxList} SettingChampionBoxList={SettingChampionBoxList}/>
        </div>
        <div className="grid-item-ItemBox">
          <ItemBox />
        </div>
        <div className="grid-item-TraitBox">
          <TraitBox />
        </div>
        <div className="grid-item-RecommendDeckBox">
          <RecommendDeckBox />
        </div>
        <div className="grid-item-SetChampionBox">
          <SetChampionBox SetChampionBoxList={SetChampionBoxList} SettingChampionBoxList={SettingChampionBoxList}/>
        </div>
      </div>
    </div>
  );
}
export default App;
