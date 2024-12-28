import { useState } from "react";
import './TraitBox.css';

const TraitBox = ({ SetChampionBoxList, traitsData }) => {
  const newSetChampionBoxList = [...new Set(SetChampionBoxList)];
  const traitCount = {};

  newSetChampionBoxList.forEach((item) => {
    item.traits.forEach((trait) => {
      if (traitCount[trait]) {
        traitCount[trait] += 1;
      } else {
        traitCount[trait] = 1;
      }
    });
  });

  const getTraitDataWithCount = () => {
    return Object.keys(traitCount)
      .map((key) => {
        const selectedTrait = traitsData.find((trait) => trait.name === key);
        if (selectedTrait) {
          // 해당 trait의 count와 맞는 효과(style) 계산
          const matchingStyle = selectedTrait.effects
            .filter(effect => effect.minUnits <= traitCount[key] && traitCount[key] <= effect.maxUnits)
            .map(effect => effect.style);

          // 중복된 스타일 제거
          const uniqueStyles = [...new Set(matchingStyle)];

          return [selectedTrait, traitCount[key], uniqueStyles];
        }
        return null;
      })
      .filter(Boolean);
  };

  const traitDataWithCount = getTraitDataWithCount();
  const sortedTraitDataWithCount = traitDataWithCount.sort((a, b) => {
    const maxStyleA = Math.max(...a[2]);
    const maxStyleB = Math.max(...b[2]);
    return maxStyleB - maxStyleA;
  });

  return (
    <div className="TraitBox">
      {sortedTraitDataWithCount.map((traitData, index) => (
        <TraitDiv key={index} data={traitData} />
      ))}
    </div>
  );
};

const TraitDiv = ({ data }) => {
  const championAbilityDesc = {
    '%i:scaleAP%': '주문력',
    '%i:scaleAD%': '공격력',
    '%i:scaleHealth%': '체력',
    '%i:scaleArmor%': '방어력',
    '%i:scaleMR%': '마법저항력',
    '%i:scaleAS%' : '공격속도',
    '%i:scaleDR%' : '내구력',
    '%i:scaleDA%' : '피해증폭',
    '%i:scaleMana%' : '추가마나',
    '%i:scaleCrit%' : '치명타확률',
    '%i:scaleCritMult%' : '치명타데미지'
  };

  const [showInfo, setShowInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });
  const traitName = data[0].name;

  const handleMouseEnter = (event) => {
    setShowInfo(true);
    const rect = event.target.getBoundingClientRect();
    console.log(rect.x)
    setInfoPosition({
      x: rect.right + 20,
      y: rect.top - 20
    });
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  let traitLevel = "";

  if (Array.isArray(data[2]) && data[2].length === 0 && data[0].effects && data[0].effects[0]) {
    traitLevel = <div className="traitLevel">{data[1]} / {data[0].effects[0].minUnits}</div>;
  } else {
    traitLevel = data[0].effects.map((effect, index) => {
      const isStyleMatch = data[2].includes(effect.style); // 스타일 일치 여부 확인
      // 조건에 맞는 값에 대해 하이라이트 여부 확인
      const isInRange = data[1] >= effect.minUnits && data[1] <= effect.maxUnits;
    
      return (
        <div className={`effectWithArrow ${isInRange ? "highlight" : ""}`} key={index}>
          <div>{effect.minUnits}</div>
          {index < data[0].effects.length - 1 && <div className="arrow"></div>}
        </div>
      );
    });
    
  }

  const replaceVariablesInDesc = () => {
    let descWithoutTags = data[0].desc
      .replace(/<(?!br\s*\/?)[^>]+>/g, '')
      .replace(/<br\s*\/?>/g, '\n');

    const extractValuesBetweenAt = (text) => {
      const matches = [];
      let i = 0;
      while (i < text.length) {
        if (text[i] === '@') {
          let j = i + 1;
          while (j < text.length && text[j] !== '@') {
            j++;
          }
          if (j < text.length && text[j] === '@') {
            matches.push(text.slice(i + 1, j));
            i = j;
          }
        }
        i++;
      }
      return matches;
    };

    const variables = extractValuesBetweenAt(descWithoutTags);

    const effectKeys = data[0].effects.reduce((acc, effect) => {
      Object.keys(effect).forEach(key => acc.push(key));
      if (effect.variables) {
        Object.keys(effect.variables).forEach(variableKey => acc.push(variableKey));
      }
      return acc;
    }, []);

    const variableObject = variables.reduce((obj, key) => {
      const lowerCaseKey = key.toLowerCase();
      const matchingEffectKey = effectKeys.find(effectKey => lowerCaseKey.includes(effectKey.toLowerCase()));

      if (matchingEffectKey) {
        obj[key] = [matchingEffectKey, 0];
      }
      return obj;
    }, {});

    let replacedDesc = descWithoutTags.replace(/%i:([^%]+)%/g, (match, key) => {
      return championAbilityDesc[`%i:${key}%`] || match;
    });

    replacedDesc = replacedDesc.replace(/@([a-zA-Z0-9_]+(?:\*[\d\.]+)?)@/g, (match, key) => {
      const value = variableObject[key];
      const effects = data[0].effects;

      const [_, multiplier] = key.split("*");

      const currentIndex = value[1];
      const currentKey = value[0];
      if (multiplier) {
        for (let i = currentIndex; i < effects.length; i++) {
          let effectValue = undefined;

          if (effects[i]?.[currentKey] !== undefined) {
            effectValue = effects[i][currentKey];
          } else if (effects[i]?.variables?.[currentKey] !== undefined) {
            effectValue = effects[i].variables[currentKey];
          }

          if (effectValue !== undefined) {
            variableObject[key][1] = i + 1;
            return (Math.round(effectValue * parseFloat(multiplier) * 10) / 10).toString();
          }
        }
      } else {
        for (let i = currentIndex; i < effects.length; i++) {
          if (effects[i]?.[currentKey] !== undefined) {
            variableObject[key][1] = i + 1;
            return (Math.round(effects[i][currentKey] * 10) / 10).toString();
          } else if (effects[i]?.variables?.[currentKey] !== undefined) {
            variableObject[key][1] = i + 1;
            return (Math.round(effects[i].variables[currentKey] * 10) / 10).toString();
          }
        }
      }

      variableObject[key][1] += 1;

      return match;
    });

    return replacedDesc;
  };

  const TraitINFO = () => {
    return (
      <div className="TraitINFO"
        style={{
          top: `${infoPosition.y}px`,
          left: `${infoPosition.x}px`,
        }}
      >
        <div className="TraitINFOName">{data[0].name}</div>
        <div className="TraitINFOData" style={{ whiteSpace: 'pre-wrap' }}>
          {replaceVariablesInDesc()}
        </div>
      </div>
    );
  };

  return (
    <div className="TraitBoxWrap">
      <div className="Trait"
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
      >
        <div 
          className={`TraitImgContainer traitStyle${data[2]}`}
          // onMouseEnter={handleMouseEnter} 
          // onMouseLeave={handleMouseLeave} 
        >
          <img
            src={`./traitImg/${traitName}.png`}
            className="TraitImg"
          />
        </div>
        <div
          className="TraitContainer"
          // onMouseEnter={handleMouseEnter} 
          // onMouseLeave={handleMouseLeave}  
        >
          <div className="traitName">
            {data[0].name}
          </div>
          <div className="traitLevel">
            {traitLevel}
          </div>
        </div>
      </div>
      {showInfo && <TraitINFO />}
    </div>
  );
};

export default TraitBox;
