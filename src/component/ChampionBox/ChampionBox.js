import React, { useState, useEffect } from 'react';
import './ChampionBox.css';
import ChampionComponent from '../ChampionComponent/ChampionComponent.js';
const ChampionBox = () => {
  const [championList, setChampionList] = useState([]);  // 사용자 상태를 관리
  const [loading, setLoading] = useState(true);  // 로딩 상태를 관리

  useEffect(() => {
    // public 폴더에 있는 data.json 파일을 fetch로 가져오기
    fetch('/TFTchampionData.json')  // '/'는 public 폴더의 루트 경로
      .then((response) => response.json())  // JSON으로 변환
      .then((data) => {
        console.log(data[0])
        setChampionList(data);  // 데이터를 상태에 저장
        setLoading(false);  // 로딩 완료
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);  // 오류 발생 시 로딩 종료
      });
  }, []);  // 컴포넌트가 마운트될 때 한 번만 실행


  // 버튼 관련 컴포넌트 만들고 championList << 리스트 재배열

  return (
  <div className='championBox'>
      {championList.map(championData => (
        //여기 시너지 관련 컴포넌트 추가 가능한지
            <ChampionComponent data = {championData}/>
          ))}

  </div>
  );
};

export default ChampionBox;
