import React, { useState, useEffect } from "react";
import './ItemBox.css'
import ItemComponent from "./ItemComponent.js";

const ItemBox = () => {
  const [ItemDataList, setItemDataList] = useState([]); 
  const [ItemType, setItemType] = useState('')
  const [activeButton, setActiveButton] = useState('Standard'); 

  const fetchData = async (type) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/${type}.json`); 
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}.json`);
      }
      let data = await response.json();

      if (type === 'Standard') {
        data = data.sort((a, b) => {
          const compositionDiff = a.composition.length - b.composition.length;
          if (compositionDiff !== 0) {
            return compositionDiff; 
          }
          return a.name.localeCompare(b.name, "ko"); 
        });
      } else {
        data = data.sort((a, b) => a.name.localeCompare(b.name, "ko")); 
      }

      setItemDataList(data); 
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

  const changeItemSupportItems = () => {
    fetchData('SupportItems');
    setItemType('SupportItems')
  };

  const ItemBoxStandardButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'Standard' ? 'active' : ''}`}
          onClick={() => {
            changeItemStandard();
            setActiveButton('Standard');
          }}
        >
          일반
        </button>
      </div>
    );
  };
  
  const ItemBoxRadiantButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'Radiant' ? 'active' : ''}`}
          onClick={() => {
            changeItemRadiant();
            setActiveButton('Radiant');
          }}
        >
          찬란
        </button>
      </div>
    );
  };
  
  const ItemBoxOrnnItemsButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'Ornn_Items' ? 'active' : ''}`}
          onClick={() => {
            changeItemOrnn_Items();
            setActiveButton('Ornn_Items');
          }}
        >
          오른
        </button>
      </div>
    );
  };
  
  const ItemBoxSupportItemsButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'SupportItems' ? 'active' : ''}`}
          onClick={() => {
            changeItemSupportItems();
            setActiveButton('SupportItems');
          }}
        >
          지원
        </button>
      </div>
    );
  };
  

  return (
    <div className="ItemBoxWrap">
      <div className="ItemBoxButtonWrap">
        <ItemBoxStandardButton />
        <ItemBoxRadiantButton />
        <ItemBoxOrnnItemsButton/>
        <ItemBoxSupportItemsButton/>
      </div>
      <div className="ItemBox">
        <div className="ItemDiv">
          <div>
          {ItemDataList.map((itemData, index) => (
            <ItemComponent key={index} itemData={itemData} ItemType={ItemType}/>
          ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItemBox;
