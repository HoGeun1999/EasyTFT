import { useState } from "react";
import React from 'react';
import './ChampionComponent.css';

const ChampionComponent = ({ data, SetChampionBoxList, SettingChampionBoxList, className }) => {
  const championData = data;
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
    const processedDesc = processAbilityDescription(
      championData['ability']['desc'],
      championAbilityDesc,
      championData['ability']['variables']
    );
    
    setShowChampionInfo(true);
    const rect = event.target.getBoundingClientRect();
    const brCount = championData.ability.desc.split("<br>").length - 1;
    const descHeight = processedDesc.length/35
    const infoDivHeight = 200 + brCount*14 + descHeight*15
    let newX = rect.right - 230
    let newY = rect.top
    if(newY+infoDivHeight>=840){
      newY = newY - infoDivHeight*0.80 - 80
    }
    else if(newX>1400){
      newX = newX - 100
      newY = rect.top + infoDivHeight*0.12 + 60
    }
    else{
      newY = rect.top + infoDivHeight*0.12 + 60
    }
    setInfoPosition({
      x: newX,
      y: newY,
    });
  };
  

  const handleMouseLeave = () => {
    setShowChampionInfo(false);
  };

  const processAbilityDescription = (description, abilityDescMap, abilityVariables) => {
    // 1. HTML 태그 제거 (<br>은 유지)
    let cleanedDescription = description.replace(/<(?!br\s*\/?)[^>]+>/g, "");

    // 2. `@Modified...@` 제거
    cleanedDescription = cleanedDescription.replace(/@Modified[^@]*@/g, "");

    // 3. 소괄호와 소괄호 뒤 첫 번째 값 제거
    cleanedDescription = cleanedDescription.replace(/\([^)]*\)[^\s]*/g, "");

    // 4. `%문자%` 치환
    let replacedDescription = cleanedDescription.replace(/%i:([^%]+)%/g, (match, key) => {
      return abilityDescMap[`%i:${key}%`] || match;
    });

    // 5. `@문자@` 치환 (abilityVariables에서 해당 키를 찾아 치환, 계산 포함)
    replacedDescription = replacedDescription.replace(/@([^@]+)@/g, (match, key) => {
      const [effectKey, multiplier] = key.split("*");
      // abilityVariables에서 key를 찾아서 값을 가져옴
      const variable = abilityVariables.find((item) => item.name === effectKey);

      if (variable) {
        let effectValue = variable.value[0]; 
        if (multiplier) {
          const multiplierValue = parseFloat(multiplier);
          effectValue *= multiplierValue; 
        }

        const formattedValue = Number.isInteger(effectValue) ? effectValue : effectValue.toFixed(2);
        return formattedValue;
      }

      return ""; // 매칭되지 않으면 빈 문자열로 반환하여 삭제 처리
    });

    // 6. <br> 태그를 줄바꿈 문자로 변환
    replacedDescription = replacedDescription.replace(/<br\s*\/?>/g, "<br/>");

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
            <div>
              <img
                className="championINFOtraitImg"
                src={`/traitImg/${trait}.png`} 
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
              src={`/img/${championData['ability']['name']}.png`} 
              alt={championData['ability']['name']}
            />
            <span>
              {championData['ability']['name']}
              <br /> 마나: {championData['stats']['initialMana']}/
              {championData['stats']['mana']}
            </span>
          </div>
          <div className="skillINFO" dangerouslySetInnerHTML={{ __html: processedDesc }} />
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
            src={`./img/${championData.name}.png`}
            alt={championData.name}
          />
        </div>
      ) : (
        <p>No user found</p>
      )}
      <div className={`championName ${championNameClass}`}>
        {championData.name}
      </div>
      {showChampionInfo && <ChampionMouseOverINFO />}
    </div>
  );
};

export default ChampionComponent;
