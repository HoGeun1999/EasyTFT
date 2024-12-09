import { useState } from "react";
import React from 'react';
import './ChampionComponent.css';
import { v4 as uuidv4 } from "uuid";

const ChampionComponent = ({ data, SetChampionBoxList, SettingChampionBoxList, className }) => {
  const championData = data; // championData를 props로 받음
  const [showChampionInfo, setShowChampionInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });

  const championAbilityDesc = {
    '%i:scaleAP%': '주문력',
    '%i:scaleAD%': '공격력',
    '%i:scaleHealth%': '체력',
    '%i:scaleArmor%': '방어력',
    '%i:scaleMR%': '마법저항력',
    '%i:scaleAS%' : '공격속도'
  };

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

  const processAbilityDescription = (description, abilityDescMap, abilityVariables) => {
    // 1. HTML 태그 제거 (<br>은 유지, 나머지 태그는 제거)
    const cleanedDescription = description.replace(/<(?!br\s*\/?)[^>]+>/g, "");

    // 2. `%문자%` 치환
    let replacedDescription = cleanedDescription.replace(/%([^%]+)%/g, (match, key) => {
      return abilityDescMap[key] || match; // 매칭되는 값이 없으면 원래 값 유지
    });

    // 3. `@문자@` 치환
    replacedDescription = replacedDescription.replace(/@([^@]+)@/g, (match, key) => {
      const variable = abilityVariables.find((item) => item.name === key);
      return variable ? variable.value[0].toString() : match; // 첫 번째 값을 문자열로 변환하여 치환
    });

    return replacedDescription;
  };

  const ChampionMouseOverINFO = () => {
    // 가공된 설명 문자열
    const processedDesc = processAbilityDescription(
      championData['ability']['desc'],
      championAbilityDesc,
      championData['ability']['variables']
    );

    return (
      <div
        className="championINFO"
        style={{
          top: `${infoPosition.y}px`,
          left: `${infoPosition.x}px`,
        }}
      >
        <div className="championINFOname">
          {championData.name} {championData.cost}$
        </div>
        <div className="championINFOtraits">
          {championData.traits.map((trait) => (
            <div key={uuidv4()}>
              <img
                className="championINFOtraitImg"
                src={`/traitImg/${trait}.png`} // public/img/traits 폴더에 이미지 저장
                alt={trait}
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
              alt={championData['ability']['name']}
            />
            <span>
              {championData['ability']['name']}
              <br /> 마나: {championData['stats']['initialMana']}/
              {championData['stats']['mana']}
            </span>
          </div>
          <div className="skillINFO">{processedDesc}</div>
        </div>
      </div>
    );
  };

  const handleClick = (event) => {
    const grandParent = event.currentTarget.parentElement.parentElement;
    const isGrandParentSetChampionBox =
      grandParent?.classList.contains('SetChampionBox');

    SettingChampionBoxList((currentList) => {
      if (isGrandParentSetChampionBox) {
        const index = currentList.findIndex((item) => item === championData);
        if (index > -1) {
          return [
            ...currentList.slice(0, index),
            ...currentList.slice(index + 1),
          ];
        }
        return currentList;
      } else {
        return [...currentList, championData];
      }
    });
  };

  const championCost = `cost-${championData.cost}`;
  const championNameLen = championData?.name ? championData.name.length : 0;
  let championNameClass = '';
  if (championNameLen >= 5) {
    championNameClass = 'long';
  }

  return (
    <div className="championComponent">
      {championData ? (
        <div
          className={`championComponent ${championCost} ${
            className ? className : ''
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <img
            src={`./img/${championData.characterName}.png`}
            alt={championData.name}
          />
        </div>
      ) : (
        <p>No user found</p>
      )}
      <div className={`championName ${championNameClass}`}>
        {championData.name}
      </div>
      <div>{showChampionInfo && <ChampionMouseOverINFO />}</div>
    </div>
  );
};

export default ChampionComponent;
