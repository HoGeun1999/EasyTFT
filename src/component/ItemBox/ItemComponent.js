import { useState } from "react";
import './ItemComponent.css';

const ItemComponent = ({ itemData, ItemType }) => {
  const [showUI, setShowUI] = useState(false); // UI 표시 여부를 관리하는 상태

  const handleMouseEnter = () => {
    setShowUI(true); // 마우스를 올리면 UI를 표시
  };

  const handleMouseLeave = () => {
    setShowUI(false); // 마우스를 나가면 UI를 숨김
  };

  const ItemComponentUI = () => {
    return (
      <div className="ItemComponentUI">
        <p>{itemData.name}</p>
        <p>{itemData.desc}</p>
      </div>
    );
  };

  return (
    <div
      className="ItemComponentWrap"
      onMouseEnter={handleMouseEnter} // 마우스가 올려질 때 이벤트
      onMouseLeave={handleMouseLeave} // 마우스가 나갈 때 이벤트
    >
      <div className="ItemImgWrap">
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
