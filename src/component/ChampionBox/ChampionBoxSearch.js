import React from 'react';
import './ChampionBoxSearch.css';

const ChampionBoxSearchBox = ({ inputValue, onInputChange }) => {
  const handleInput = (e) => {
    onInputChange(e.target.value); 
  };

  return (
    <div className='inputBoxWrap'>
      <input
        className='inputBox'
        type="text"
        value={inputValue}  
        onInput={handleInput}  
        placeholder="  챔피언 이름 검색"
      />
    </div>
  );
};

export default ChampionBoxSearchBox;
