import { useState } from "react";
import './ChampionComponent.css';

const ChampionComponent = ({ data,SetChampionBoxList,SettingChampionBoxList}) => {
  const championData = data; // championData를 props로 받음
  const [showChampionInfo, setShowChampionInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event) => {
    setShowChampionInfo(true);
    const rect = event.target.getBoundingClientRect();
    setInfoPosition({
      x: rect.right + 10,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setShowChampionInfo(false);
  };

  const ChampionMouseOverINFO = () => {
    return (
      <div className="championINFO">
        {championData.name}
      </div>
    );
  };

  const handleClick = () => {
    SettingChampionBoxList(SetChampionBoxList => [...SetChampionBoxList,championData])
  };

  const championCost = `cost-${championData.cost}`;
  const championNameLen = championData.name.length;
  let championNameClass = '';
  if (championNameLen >= 5) {
    championNameClass = 'long';
  }

  return (
    <div className="championComponent">
      {championData ? (
        <div
          className={`championComponent ${championCost}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick} // 클릭 시 handleClick 호출
        >
          <img src={`./img/${championData.characterName}.png`} alt={championData.name} />
        </div>
      ) : (
        <p>No user found</p>
      )}
      <div>
        {showChampionInfo && <ChampionMouseOverINFO />}
      </div>
      <div className={`championName ${championNameClass}`}>
        {championData.name}
      </div>
    </div>
  );
};

export default ChampionComponent;
