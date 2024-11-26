import React from 'react';
import ChampionComponent from '../ChampionComponent/ChampionComponent';

const SetChampionBox = ({ SetChampionBoxList, SettingChampionBoxList }) => {
  return (

    <div className="SetChampionBox">
      {/* SetChampionBoxList의 각 객체를 순회하면서 ChampionComponent를 렌더링 */}
      {SetChampionBoxList.map((championData, index) => (
        <ChampionComponent // 각 항목에 고유한 key를 부여
          data={championData} // SetChampionBoxList의 객체를 data로 전달
          SetChampionBoxList={SetChampionBoxList} // SetChampionBoxList 전달
          SettingChampionBoxList={SettingChampionBoxList} // SettingChampionBoxList 전달
        />
      ))}
    </div>
  );
};

export default SetChampionBox;
