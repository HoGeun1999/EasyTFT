import React, { useState } from 'react';

const ChampionBoxSearchBox = ({ inputValue, onInputChange }) => {
  // onInput을 사용할 경우 상태를 실시간으로 업데이트
  const handleInput = (e) => {
    onInputChange(e.target.value); // 부모에게 변경된 값 전달
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}  // 부모 컴포넌트에서 전달된 값 사용
        onInput={handleInput}  // 실시간으로 입력값을 부모에게 전달
        placeholder="검색어를 입력하세요..."
        style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
      />
    </div>
  );
};

export default ChampionBoxSearchBox;
