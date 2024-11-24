import React, { useState, useEffect } from 'react';
import './ChampionBox.css';
import ChampionComponent from '../ChampionComponent/ChampionComponent.js';
import ChampionBoxSearchBox from './ChampionBoxSearch.js';

const ChampionBox = ({championList,setChampionList,SetChampionBoxList,SettingChampionBoxList}) => {
  const [lineButton, setLineButton] = useState(false);
  const [jobButton, setJobButton] = useState(false);
  // *************** 밑에 두 변수는 수작업 해야함(시즌별로 1번 버전별로는 안바뀜) ************
  const lineList = ['달콤술사','드루이드','마녀','벌꿀술사','서리','섬뜩한 힘','시공간','아르카나','요정','용','차원문','허기','화염']
  const jobList = ['단짝','마도사','박쥐여왕','보호술사','사냥꾼','선봉대','쇄도자','요새','요술사','전사','초월체','폭파단','학자','형상변환자']
  const [result, setResult] = useState({});
  const [sortedKeys, setSortedKeys] = useState([]);
  const [searchInput, setSearchInput] = useState('');  // 부모에서 상태 관리
  const ChampionBoxNameButton = () => {
    return(
      <div className='buttonWrap'>
        <button onClick={relocationChampionName}>이름순</button>
      </div>
    )
  }

  const ChampionBoxCostButton = () => {
    return(
      <div className='buttonWrap'>
        <button onClick={relocationChampionCost}>가격순</button>
      </div>
    )
  }

  const ChampionBoxLineButton = () => {
    return(
      <div className='buttonWrap'>
        <button onClick={relocationChampionLine}>계열별</button>
      </div>
    )
  }

  const ChampionBoxJobButton = () => {
    return(
      <div className='buttonWrap'>
        <button onClick={relocationChampionJob}>직업별</button>
      </div>
    )
  }

  const relocationChampionName = () => {
    setLineButton(false);
    setJobButton(false);
    const relocatedData = [...championList].sort((a, b) => {
      return a.name.localeCompare(b.name, 'ko'); // 한글 로케일을 기준으로 비교
    });
    setChampionList(relocatedData);
  }   

  const relocationChampionCost = () => {
    setLineButton(false);
    setJobButton(false);
    const relocatedData = [...championList].sort((a, b) => {
      return a.cost - b.cost;
    });
    setChampionList(relocatedData);
  } 
  
  const relocationChampionLine = () => {
    setLineButton(true);
    setJobButton(false);
    const newResult = {};
    lineList.forEach((line) => {
      newResult[line] = championList.filter((data) => data.traits.includes(line));
    });
    // 2. result를 상태로 설정
    setResult(newResult);
    // 3. sortedKeys 계산: result의 key들을 한국어 순서로 정렬
    const sorted = Object.keys(newResult).sort((a, b) => a.localeCompare(b));
    setSortedKeys(sorted);
  } 

  const relocationChampionJob = () => {
    setLineButton(false);
    setJobButton(true);
    const newResult = {};
    jobList.forEach((job) => {
      newResult[job] = championList.filter((data) => data.traits.includes(job));
    });
    setResult(newResult)
    const sorted = Object.keys(newResult).sort((a, b) => a.localeCompare(b));
    setSortedKeys(sorted);
  } 



  // input 값이 변경되면 부모 상태를 업데이트하는 함수
  const handleInputChange = (value) => {
    setSearchInput(value);
  };


  return (
  <div className='championBox'>
    <div className='championBoxTool'>
      <ChampionBoxNameButton
        championList={championList}/>
      <ChampionBoxCostButton/>
      <ChampionBoxLineButton/>
      <ChampionBoxJobButton/>
      <ChampionBoxSearchBox
          inputValue={searchInput}   // 부모 컴포넌트의 상태를 props로 전달
          onInputChange={handleInputChange} // input 값 변경 시 부모로 전달하는 함수
        />
    </div>

    {lineButton ? (
      <div className="championBoxSet">
         {sortedKeys.map((key) => {
        const sortedData = result[key].sort((a, b) => a.name.localeCompare(b.name)); // name으로 정렬

        return (
          <div key={key}>
            {sortedData
              .filter(championData => 
                championData.name.toLowerCase().includes(searchInput.toLowerCase()) // name에 searchInput 포함 여부 확인
              ).length > 0 && (
                <div>{key}</div>  // 필터링된 데이터가 있을 경우에만 머릿말 출력
            )}
            
            {sortedData
              .filter(championData => 
                championData.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((championData) => (
                <ChampionComponent data={championData} SetChampionBoxList={SetChampionBoxList} SettingChampionBoxList={SettingChampionBoxList}/>
              ))}
          </div>
        );
      })}
      </div>
    ) : jobButton ? (
      <div className="championBoxSet">
        {sortedKeys.map((key) => {
          // key에 해당하는 데이터 정렬
          const sortedData = result[key].sort((a, b) => a.name.localeCompare(b.name)); // name으로 정렬
          return (
            <div key={key}>
                {/* 필터링된 데이터가 있을 경우에만 key를 렌더링 */}
                {sortedData
                  .filter(championData => 
                    championData.name.toLowerCase().includes(searchInput.toLowerCase()) // name에 searchInput 포함 여부 확인
                  ).length > 0 && (
                    <div>{key}</div>  // 필터링된 데이터가 있을 경우에만 머릿말 출력
                )}
                
                {/* 검색 조건 추가: name에 searchInput이 포함된 챔피언만 필터링 */}
                {sortedData
                  .filter(championData => 
                    championData.name.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((championData) => (
                    <ChampionComponent data={championData} SetChampionBoxList={SetChampionBoxList} SettingChampionBoxList={SettingChampionBoxList}/>
                  ))}
              </div>
          );
        })}
      </div>
    ) : (
    <div className="championBoxSet">
      {championList
        .filter(championData => 
          championData.name.toLowerCase().includes(searchInput.toLowerCase()) // 이름에 searchInput이 포함된 챔피언만 필터링
        )
        .map(championData => (
          <ChampionComponent data={championData} SetChampionBoxList={SetChampionBoxList} SettingChampionBoxList={SettingChampionBoxList}/> // 각 챔피언에 고유 key를 부여
        ))
      }
    </div>
    )}
      </div>
      );
};



export default ChampionBox;
