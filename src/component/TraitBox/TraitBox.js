import { useState } from "react";
import './TraitBox.css'
const TraitBox = ({SetChampionBoxList,traitsData}) => {
    const newSetChampionBoxList = [...new Set(SetChampionBoxList)];  // Set을 사용하여 중복 제거
    const traitCount = {}
    newSetChampionBoxList.forEach((item) => {
        // 2. item['traits']을 순회
        item.traits.forEach((trait) => {
          // 3. traits를 key로 갯수를 세는 객체 만들기
          if (traitCount[trait]) {
            traitCount[trait] += 1; // 이미 존재하면 갯수 증가
          } else {
            traitCount[trait] = 1; // 없으면 초기화
          }
        });
      });

      const getTraitDataWithCount = () => {
        return Object.keys(traitCount)
          .map((key) => {
            // traitsData에서 name이 key와 일치하는 항목을 찾기
            const selectedTrait = traitsData.find((trait) => trait.name === key);
            if (selectedTrait) {
              // 1. traitsData['effects']를 순회하여 minUnits <= traitCount[key] <= maxUnits 인지 체크
              const matchingStyle = selectedTrait.effects
                .filter(effect => effect.minUnits <= traitCount[key] && traitCount[key] <= effect.maxUnits)
                .map(effect => effect.style);  // 해당 조건에 맞는 style 값을 추출

              // 2. 선택된 traitsData와 matchingStyle을 함께 반환
              return [selectedTrait, traitCount[key], matchingStyle];
            }
            return null;  // 일치하는 traitsData가 없으면 null 반환
          })
          .filter(Boolean)
      };
      

    const traitDataWithCount = getTraitDataWithCount();

    const sortedTraitDataWithCount = traitDataWithCount.sort((a, b) => {
        // matchingStyle 배열의 최대값을 비교
        const maxStyleA = Math.max(...a[2]); // a의 matchingStyle에서 최대값
        const maxStyleB = Math.max(...b[2]); // b의 matchingStyle에서 최대값
        return maxStyleB - maxStyleA; // 내림차순 정렬
      });

      


    return (
        <div className="TraitBox">
          {sortedTraitDataWithCount.map((traitData, index) => (
            <TraitDiv key={index} data={traitData} />
          ))}
        </div>
      );
}





const TraitDiv = ({data}) => {
    console.log(data[0]);  // data 배열 확인용
    const [showInfo, setShowInfo] = useState(false); // 상태 추가
    const traitName = data[0].name;  // data 배열의 첫 번째 요소에서 name을 가져옵니다.
    
    let traitLevel = "";  // 기본 값 설정

    if (Array.isArray(data[2]) && data[2].length === 0 && data[0].effects && data[0].effects[0]) {
        traitLevel = <div className="traitLevel">{data[1]} / {data[0].effects[0].minUnits}</div>
      }
    else {
    traitLevel = data[0].effects.map((effect, index) => {
        // 2. data[0].effects.style 값과 data[2] 값이 일치할 경우에만 class 추가
        const isStyleMatch = data[2].includes(effect.style);
        return (
        <div
            className={`effectWithArrow ${isStyleMatch ? "highlight" : ""}`}
            key={index}
        >
            <div>{effect.minUnits}</div>
            {index < data[0].effects.length - 1 && <div className="arrow"></div>} {/* 마지막 요소에는 화살표를 추가하지 않음 */}
        </div>
        );
    });
    }

    const TraitINFO = () => {

      const replaceVariablesInDesc = () => {
        // 정규 표현식: @key@ 형태의 문자열을 찾기
        const regex = /@([a-zA-Z0-9_]+)@/g;
    
        return data[0].desc.replace(regex, (_, key) => {
          // data[0].effects 배열에서 key가 존재하는지 확인하고 해당 값으로 치환
          for (let effect of data[0].effects) {
            if (effect.variables && key in effect.variables) {
              return effect.variables[key];
            }
          }
          // key가 없다면 원래의 @key@를 그대로 반환
          return `@${key}@`;
        });
      };

      return(
        <div className="TraitINFO">
          <div className="TraitINFOName">{data[0].name}</div>
          <div className="TraitINFOData">{replaceVariablesInDesc()}</div>
        </div>
      )
    }

    return (
      <div
        className="Trait"
        onMouseEnter={() => setShowInfo(true)} // 마우스를 올렸을 때
        onMouseLeave={() => setShowInfo(false)} // 마우스가 떠났을 때
      > 
        <div className={`TraitImgContainer traitStyle${data[2]}`}>
            <img 
            src={`./traitImg/${traitName}.png`}
            className="TraitImg"  // name을 파일명으로 사용
          />
        </div>
        <div className="TraitContainer">
            <div className="traitName">
                {data[0].name}
            </div>
            <div className="traitLevel">
                {traitLevel}
            </div>
        </div>
        {showInfo && <TraitINFO/>}
      </div>
    );
  };

export default TraitBox