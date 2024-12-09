import { useState, useEffect } from "react";
import './ItemComponent.css';

const ItemComponent = ({ itemData, ItemType }) => {
  const [showUI, setShowUI] = useState(false); // UI 표시 여부를 관리하는 상태
  const [itemList, setItemList] = useState([]); // 아이템 데이터를 저장할 상태
  const itemAbilityDesc = {
    '%i:scaleAP%': '주문력',
    '%i:scaleAD%': '공격력',
    '%i:scaleHealth%': '체력',
    '%i:scaleArmor%': '방어력',
    '%i:scaleMR%': '마법저항력',
    '%i:scaleAS%' : '공격속도'
  };

  // 아이템 설명 처리 함수
  const processItemDescription = (description, abilityDescMap, effects) => {
    // 1. HTML 태그 제거 (<br>은 유지)
    const cleanedDescription = description.replace(/<(?!br\s*\/?)[^>]+>/g, "");

    // 2. `%문자%` 치환
    let replacedDescription = cleanedDescription.replace(/%([^%]+)%/g, (match, key) => {
      return abilityDescMap[`%${key}%`] || match; // 매칭되는 값이 없으면 원래 값 유지
    });

    // 3. `@문자@` 치환 (effects에서 해당 키를 찾아 치환, 계산 포함)
    replacedDescription = replacedDescription.replace(/@([^@]+)@/g, (match, key) => {
      const [effectKey, multiplier] = key.split("*");
      if (effects?.[effectKey] !== undefined) {
        const effectValue = effects[effectKey];
        return multiplier ? (effectValue * parseFloat(multiplier)).toString() : effectValue.toString();
      }
      return match; // 매칭되지 않는 경우 원래 값 유지
    });

    // 4. `<br>` 태그를 React에서 동작하도록 처리
    return replacedDescription.replace(/<br>/g, "<br/>");
  };

  // 마우스 이벤트 처리
  const handleMouseEnter = () => {
    setShowUI(true); // 마우스를 올리면 UI를 표시
  };

  const handleMouseLeave = () => {
    setShowUI(false); // 마우스를 나가면 UI를 숨김
  };

  // 아이템 데이터 가져오기
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`/${ItemType}.json`); // JSON 파일 경로
        const data = await response.json();
        setItemList(data); // 아이템 데이터를 state에 저장
      } catch (error) {
        console.error("Error loading item list:", error);
      }
    };

    fetchItemData(); // 데이터 불러오기
  }, [ItemType]); // ItemType이 변경될 때마다 데이터 다시 불러오기

  const ItemComponentUI = () => {
    // 가공된 설명 문자열
    const processedDesc = processItemDescription(
      itemData.desc,
      itemAbilityDesc,
      itemData.effects // effects 객체를 전달
    );

    // composition 배열에서 apiName에 해당하는 아이템의 desc를 찾아서 표시
    const compositionDescriptions = itemData.composition.map((apiName) => {
      const item = itemList.find((i) => i.apiName === apiName); // apiName을 사용하여 아이템 찾기
      if (item) {
        return processItemDescription(item.desc, itemAbilityDesc, item.effects); // 해당 아이템의 desc 반환
      }
      return null; // 아이템을 찾지 못한 경우
    });

    return (
      <div className="ItemComponentUI">
        <p>{itemData.name}</p>
        <p dangerouslySetInnerHTML={{ __html: processedDesc }} /> {/* HTML로 렌더링 */}
        {itemData.composition.length > 0 && (
          <div className="composition">
            {compositionDescriptions.map((desc, index) => (
              desc ? (
                <p key={index} dangerouslySetInnerHTML={{ __html: desc }} /> // 각 desc를 HTML로 렌더링
              ) : null
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ItemComponentWrap">
      <div
        className="ItemImgWrap"
        onMouseEnter={handleMouseEnter} // 마우스가 올려질 때 이벤트
        onMouseLeave={handleMouseLeave} // 마우스를 나갈 때 이벤트
      >
        <img
          src={`/itemImg/${ItemType}/${itemData.name}.png`}
          alt={itemData.name}
          className="ItemImage"
        />
      </div>
      {showUI && <ItemComponentUI />} {/* showUI가 true일 때만 UI 표시 */}
    </div>
  );
};

export default ItemComponent;
