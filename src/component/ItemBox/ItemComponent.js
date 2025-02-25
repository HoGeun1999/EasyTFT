import React, { useState, useEffect } from "react"; // React import 추가
import "./ItemComponent.css";

const ItemComponent = ({ itemData, ItemType }) => {
  const [showUI, setShowUI] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemLocation, seItemLocation] = useState({ x: 0, y: 0 });
  const itemStats = {
    Armor: "방어력",
    Health: "체력",
    AP: "주문력",
    CritChance: "치명타확률",
    AS: "공격속도",
    AD: "공격력",
    BonusDamage: "피해량 증가",
    Mana: "마나",
    MagicResist: "마법저항력",
    LifeSteal: "모든 피해 흡혈",
  };

  // 아이템 설명 처리 함수
  const processItemDescription = (description, effects) => {
    // 1. HTML 태그 제거 (<br>은 유지)
    const cleanedDescription = description.replace(/<(?!br\s*\/?)[^>]+>/g, "");

    // 2. `@문자@`와 뒤에 이어지는 한 글자를 치환 (effects에서 해당 키를 찾아 치환, 계산 포함)
    const replacedDescription = cleanedDescription.replace(
      /@([^@]+)@(.)?/g,
      (match, key) => {
        const [effectKey, multiplier] = key.split("*");
        if (effects?.[effectKey] !== undefined) {
          const effectValue = effects[effectKey];
          const calculatedValue = multiplier
            ? effectValue * parseFloat(multiplier)
            : effectValue;
          return Math.round(calculatedValue * 10) / 10; // 소수점 첫 번째 자리에서 반올림
        }
        return ""; // 매칭되지 않으면 빈 문자열 반환
      }
    );

    // 3. <br> 태그를 React 컴포넌트로 변환
    return replacedDescription.split(/<br\s*\/?>/).map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < replacedDescription.split(/<br\s*\/?>/).length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // 마우스 이벤트 처리
  const handleMouseEnter = (event) => {
    setShowUI(true);
    const rect = event.target.getBoundingClientRect();
    seItemLocation({
      x: rect.x,
      y: rect.y,
    });
  };
  
  const handleMouseLeave = () => {
    setShowUI(false);
  };

  // 아이템 데이터 가져오기
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/${ItemType}.json`);
        const data = await response.json();
        setItemList(data);
      } catch (error) {
        console.error("Error loading item list:", error);
      }
    };
    fetchItemData();
  }, [ItemType]);

  const ItemComponentUI = () => {
    // 가공된 설명 문자열
    const processedDesc = processItemDescription(itemData.desc, itemData.effects);
    let ItemUI = "ItemComponentUI";
    if (itemLocation.x > 1760) {
      ItemUI = "ItemComponentUI-right";
    }

    return (
      <div className={ItemUI}>
        <p>{itemData.name}</p>
        <p>{processedDesc}</p>
        <div className="ItemEffects">
          {Object.keys(itemData.effects).map((key) => {
            if (itemStats[key]) {
              let effectValue = itemData.effects[key];
              // itemUi 예외케이스 처리
              if (key === "AD" || key === "BonusDamage") {
                effectValue = Math.round(effectValue * 1000) / 10; // 100배 후 소수점 첫째 자리 반올림
                return (
                  <div key={key}>
                    {itemStats[key]}: {effectValue}%
                  </div>
                );
              }
              if (key === "AS" || key === "CritChance" || key === "LifeSteal") {
                effectValue = Math.round(effectValue * 10) / 10; // 100배 후 소수점 첫째 자리 반올림
                return (
                  <div key={key}>
                    {itemStats[key]}: {effectValue}%
                  </div>
                );
              }

              return (
                <div key={key}>
                  {itemStats[key]}: {effectValue}
                </div>
              );
            }
            return null;
          })}
          <div className="ItemComposition">
            {itemData.composition.map((apiName, index) => {
              const item = itemList.find((i) => i.apiName === apiName);
              if (item) {
                return (
                  <React.Fragment key={item.apiName}>
                    <div className="compositionWrap">
                      <img
                        src={`${process.env.PUBLIC_URL}/itemImg/${ItemType}/${item.name}.png`}
                        alt={item.name}
                        className="ItemCompositionIcon"
                      />
                      {index < itemData.composition.length - 1 && "+"}
                    </div>
                  </React.Fragment>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ItemComponentWrap">
      <div
        className="ItemImgWrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={`${process.env.PUBLIC_URL}/itemImg/${ItemType}/${itemData.name}.png`}
          alt={itemData.name}
          className="ItemImage"
        />
      </div>
      {showUI && <ItemComponentUI />}
    </div>
  );
};

export default ItemComponent;
