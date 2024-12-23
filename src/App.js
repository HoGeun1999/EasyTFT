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
  const [traitsData, setTraitsData] = useState(null); // 데이터를 저장할 상태 변수

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

  useEffect(() => {
    // public 폴더에 있는 TFTtraitsData.json 파일을 가져옵니다.
    fetch('/TFTtraitsData.json')
      .then((response) => response.json()) // JSON으로 파싱
      .then((data) => setTraitsData(data))  // 데이터를 상태에 저장
      .catch((error) => console.error("데이터를 가져오는 데 오류가 발생했습니다.", error)); // 에러 처리
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행


  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid-item-ChampionBox">
          <ChampionBox 
          championList={championList} 
          setChampionList={setChampionList} 
          SetChampionBoxList={SetChampionBoxList} 
          SettingChampionBoxList={SettingChampionBoxList}/>
        </div>
        <div className="grid-item-ItemBox">
          <ItemBox />
        </div>
        <div className="grid-item-TraitBox">
          <TraitBox 
          SetChampionBoxList={SetChampionBoxList}
          traitsData={traitsData}/>
        </div>
        <div className="grid-item-RecommendDeckBox">
          <RecommendDeckBox 
          SetChampionBoxList={SetChampionBoxList} 
          SettingChampionBoxList={SettingChampionBoxList}/>
        </div>
        <div className="grid-item-SetChampionBox">
          <SetChampionBox 
          SetChampionBoxList={SetChampionBoxList} 
          SettingChampionBoxList={SettingChampionBoxList} />
        </div>
      </div>
      <div className='version'>14.24 version</div>
    </div>
  );
}
export default App;
