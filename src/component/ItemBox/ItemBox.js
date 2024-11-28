import React, { useState, useEffect } from "react";
import './ItemBox.css'
import ItemComponent from "./ItemComponent.js";

const ItemBox = () => {
  const [ItemDataList, setItemDataList] = useState([]); // 데이터를 저장할 상태
  const [ItemType, setItemType] = useState('')
  const ItemTypeList = ['Ornn_Items', 'Radiant', 'Standard', 'TFT9_SupportItems']; // 타입 리스트

  const fetchData = async (type) => {
    try {
      const response = await fetch(`/${type}.json`); // public 폴더의 JSON 파일 가져오기
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}.json`);
      }
      let data = await response.json();

      // 정렬 로직 추가
      if (type === 'Standard') {
        data = data.sort((a, b) => {
          const compositionDiff = a.composition.length - b.composition.length;
          if (compositionDiff !== 0) {
            return compositionDiff; // composition 길이 기준 정렬
          }
          return a.name.localeCompare(b.name, "ko"); // 한글 이름 기준 정렬
        });
      } else {
        data = data.sort((a, b) => a.name.localeCompare(b.name, "ko")); // 이름 기준 정렬
      }

      setItemDataList(data); // 정렬된 데이터 상태에 저장
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData('Standard');
    setItemType('Standard')
  }, []);

  const changeItemStandard = () => {
    fetchData('Standard');
    setItemType('Standard')
  };

  const changeItemRadiant = () => {
    fetchData('Radiant');
    setItemType('Radiant')
  };

  const changeItemOrnn_Items = () => {
    fetchData('Ornn_Items');
    setItemType('Ornn_Items')
  };

  const changeItemTFT9_SupportItems = () => {
    fetchData('TFT9_SupportItems');
    setItemType('TFT9_SupportItems')
  };

  const ItemBoxStandardButton = () => {
    return (
      <div className="buttonWrap">
        <button onClick={changeItemStandard}>일반</button>
      </div>
    );
  };

  const ItemBoxRadiantButton = () => {
    return (
      <div className="buttonWrap">
        <button onClick={changeItemRadiant}>찬란</button>
      </div>
    );
  };

  const ItemBoxOrnn_ItemsButton = () => {
    return (
      <div className="buttonWrap">
        <button onClick={changeItemOrnn_Items}>오른</button>
      </div>
    );
  };

  const ItemBoxTFT9_SupportItemsButton = () => {
    return (
      <div className="buttonWrap">
        <button onClick={changeItemTFT9_SupportItems}>지원</button>
      </div>
    );
  };

  return (
    <div className="ItemBox">
      <div className="ItemBoxButtonWrap">
            <ItemBoxStandardButton />
            <ItemBoxRadiantButton />
            <ItemBoxOrnn_ItemsButton/>
            <ItemBoxTFT9_SupportItemsButton/>
        </div>

      <div className="ItemDiv">
        {ItemDataList.map((itemData, index) => (
          <ItemComponent key={index} itemData={itemData} ItemType={ItemType}/>
        ))}
      </div>



    </div>
  );
};

export default ItemBox;
