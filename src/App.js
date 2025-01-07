import './App.css';
import ChampionBox from './component/ChampionBox/ChampionBox';
import ItemBox from './component/ItemBox/ItemBox';
import TraitBox from './component/TraitBox/TraitBox';
import RecommendDeckBox from './component/RecommendDeckBox/RecommendDeckBox';
import SetChampionBox from './component/SetChampionBox/SetChampionBox';
import { useState, useEffect } from 'react';

function App() {
  const [SetChampionBoxList, SettingChampionBoxList] = useState([]);
  const [championList, setChampionList] = useState([]);  // 사용자 상태를 관리
  const [traitsData, setTraitsData] = useState(null); // 데이터를 저장할 상태 변수
  
  useEffect(() => {
    // 비동기 함수 정의
    const fetchChampionData = async () => {
      try {
        const response = await fetch('./TFTchampionData.json');
        const data = await response.json();  // JSON으로 변환
        const relocatedData = [...data].sort((a, b) => {
          return a.name.localeCompare(b.name, 'ko');
        });
        setChampionList(relocatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchChampionData();  // 비동기 함수 호출
  }, []);  // 컴포넌트가 처음 렌더링될 때만 실행

  useEffect(() => {
    // 비동기 함수 정의
    const fetchTraitsData = async () => {
      try {
        const response = await fetch('./TFTtraitsData.json');
        const data = await response.json();  // JSON으로 파싱
        setTraitsData(data);  // 데이터를 상태에 저장
      } catch (error) {
        console.error("데이터를 가져오는 데 오류가 발생했습니다.", error);
      }
    };

    fetchTraitsData();  // 비동기 함수 호출
  }, []);  // 컴포넌트가 처음 렌더링될 때만 실행

  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid-item-ChampionBox">
          <ChampionBox 
            championList={championList} 
            setChampionList={setChampionList} 
            SetChampionBoxList={SetChampionBoxList} 
            SettingChampionBoxList={SettingChampionBoxList}
          />
        </div>
        <div className="grid-item-ItemBox">
          <ItemBox />
        </div>
        <div className="grid-item-TraitBox">
          <TraitBox 
            SetChampionBoxList={SetChampionBoxList}
            traitsData={traitsData}
          />
        </div>
        <div className="grid-item-RecommendDeckBox">
          <RecommendDeckBox 
            SetChampionBoxList={SetChampionBoxList} 
            SettingChampionBoxList={SettingChampionBoxList}
          />
        </div>
        <div className="grid-item-SetChampionBox">
          <SetChampionBox 
            SetChampionBoxList={SetChampionBoxList} 
            SettingChampionBoxList={SettingChampionBoxList}
          />
        </div>
      </div>
      <div className='version'>14.24 version</div>
    </div>
  );
}

export default App;
