import { useState } from "react";
import React from 'react';
import './ChampionComponent.css';
import { v4 as uuidv4 } from "uuid";

const ChampionComponent = ({ data,SetChampionBoxList,SettingChampionBoxList}) => {
  const championData = data; // championData를 props로 받음
  const [showChampionInfo, setShowChampionInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event) => {
    setShowChampionInfo(true);
    const rect = event.target.getBoundingClientRect();
    setInfoPosition({
      x: rect.right + 10,
      y: rect.top - 150,
    });
  };

  const handleMouseLeave = () => {
    setShowChampionInfo(false);
  };

  const ChampionMouseOverINFO = () => {
    return (
      <div className="championINFO" style={{
        top: `${infoPosition.y}px`,
        left: `${infoPosition.x}px`,
      }}>
        <div className="championINFOname">{championData.name} {championData.cost}$</div>
        <div className="championINFOtraits">
          {championData.traits.map((trait) => (
            <div>
              <img 
                className="championINFOtraitImg"
                src={`/traitImg/${trait}.png`} // public/img/traits 폴더에 이미지 저장
              />
              <span>{trait}</span>
            </div>
          ))}
        </div>
        <div className="championINFOskill">
          <div className="skillWrap">
            <img 
              className="championINFOskillImg"
              src={`/img/${championData['ability']['name']}.png`} // public/img/traits 폴더에 이미지 저장
            />
            <span>{championData['ability']['name']}<br/> 마나: {championData['stats']['initialMana']}/{championData['stats']['mana']}</span>
          </div>
          <div className="skillINFO">
            {championData['ability']['desc']}
          </div>
        </div>
      </div>
    );
  };
  // const ChampionComponent = ({ data,SetChampionBoxList,SettingChampionBoxList}) => {
  const handleClick = (event) => {
    // 부모의 부모 요소 가져오기
    const grandParent = event.currentTarget.parentElement;
    const isGrandParentSetChampionBox = grandParent?.classList.contains('SetChampionBox');

    SettingChampionBoxList((currentList) => {
      if (isGrandParentSetChampionBox) {
        // 부모가 SetChampionBox인 경우: 리스트에서 해당 데이터를 첫 번째로 발견된 것만 삭제
        const index = currentList.findIndex((item) => item === championData);
        if (index > -1) {
          return [
            ...currentList.slice(0, index), // 삭제 대상 이전 항목
            ...currentList.slice(index + 1), // 삭제 대상 이후 항목
          ];
        }
        return currentList; // 삭제 대상이 없으면 그대로 반환
      } else {
        // 부모가 SetChampionBox가 아닌 경우: 리스트에 데이터 추가
        return [...currentList, championData];
      }
    });
  };

  const championCost = `cost-${championData.cost}`;
  const championNameLen = championData.name.length;
  let championNameClass = '';
  if (championNameLen >= 5) {
    championNameClass = 'long';
  }

  return (
    <div className="championComponent"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick} // 클릭 시 handleClick 호출
    >
        {championData ? (
          <div
            className={`championComponent ${championCost}`}
          >
            <img src={`./img/${championData.characterName}.png`} alt={championData.name} />
          </div>
          
        ) : (
          <p>No user found</p>
        )}
        <div className={`championName ${championNameClass}`}>
          {championData.name}
        </div>
      <div>
        {showChampionInfo && <ChampionMouseOverINFO />}
      </div>

    </div>
  );
};

export default ChampionComponent;
