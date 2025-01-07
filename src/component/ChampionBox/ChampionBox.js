import React, { useState, useEffect } from 'react';
import './ChampionBox.css';
import ChampionComponent from '../ChampionComponent/ChampionComponent.js';
import ChampionBoxSearchBox from './ChampionBoxSearch.js';

const ChampionBox = ({championList,setChampionList,SetChampionBoxList,SettingChampionBoxList}) => {
  const [lineButton, setLineButton] = useState(false);
  const [jobButton, setJobButton] = useState(false);
  // *************** 밑에 두 변수는 수작업 해야함(시즌별로 1번 버전별로는 안바뀜) ************
  const lineList = ['가족','검은 장미단','고물상','고물의 왕','기계화의 전령관','도박꾼','반군','사절','실험체','아카데미','자동기계','점화단','정복자','집행자','추방된 마법사','피의 사냥꾼','화공 남작']
  const jobList = ['감시자','기동타격대','난동꾼','마법사','매복자','선도자','저격수','주시자','지배자','투사','포수','형태전환자']
  const [result, setResult] = useState({});
  const [sortedKeys, setSortedKeys] = useState([]);
  const [searchInput, setSearchInput] = useState(''); 
  const [data, setData] = useState(null);
  const [activeButton, setActiveButton] = useState('name'); // 현재 활성화된 버튼 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./TFTtraitsData.json');     
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData); 
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchData();
  }, []); 

  // 챔피언박스 버튼 컴포넌트 모음 
  const ChampionBoxNameButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'name' ? 'active' : ''}`}
          onClick={() => {
            relocationChampionName();
            setActiveButton('name');
          }}
        >
          이름순
        </button>
      </div>
    );
  };
  
  const ChampionBoxCostButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'cost' ? 'active' : ''}`}
          onClick={() => {
            relocationChampionCost();
            setActiveButton('cost');
          }}
        >
          가격순
        </button>
      </div>
    );
  };
  
  const ChampionBoxLineButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'line' ? 'active' : ''}`}
          onClick={() => {
            relocationChampionLine();
            setActiveButton('line');
          }}
        >
          계열별
        </button>
      </div>
    );
  };
  
  const ChampionBoxJobButton = () => {
    return (
      <div className="buttonWrap">
        <button
          className={`button ${activeButton === 'job' ? 'active' : ''}`}
          onClick={() => {
            relocationChampionJob();
            setActiveButton('job');
          }}
        >
          직업별
        </button>
      </div>
    );
  };

  // 챔피언박스의 버튼 클릭시 챔피언 정렬(버튼 종류별로)
  const relocationChampionName = () => {
    setLineButton(false);
    setJobButton(false);
    const relocatedData = [...championList].sort((a, b) => {
      return a.name.localeCompare(b.name, 'ko');
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
    setResult(newResult);
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
    <div className='championBoxWrap'>
      <div className='championBoxTool'>
        <ChampionBoxNameButton
          championList={championList}/>
        <ChampionBoxCostButton/>
        <ChampionBoxLineButton/>
        <ChampionBoxJobButton/>
        <ChampionBoxSearchBox
            inputValue={searchInput}   
            onInputChange={handleInputChange} 
        />
      </div>
    <div className='championBox'>
      {lineButton ? (  // 챔피언 박스의 버튼이 lineButton일때 랜더링
      <div className="championBoxSet">
        {sortedKeys.map((key) => {
        const sortedData = result[key].sort((a, b) => a.name.localeCompare(b.name));
        return (
          <div key={key}>
            {sortedData
              .filter(championData => 
                championData.name.toLowerCase().includes(searchInput.toLowerCase()) // name에 searchInput 포함 여부 확인
              ).length > 0 && (
                <div className='TraitWrap'>
                  <div className='TraitImgWrap'>
                    <img
                      src={`./traitImg/${key}.png`}
                      className='TraitImg'
                      alt='traitImg'
                    />
                  </div>
                  <div className='TraitTextWrap'>
                    {key}
                  </div>
                  <div className='EffectsWrap'>
                    {data && // JSON 데이터를 성공적으로 불러온 경우에만 렌더링
                      data
                        .filter((dataItem) => dataItem.name === key) // data.name === key인 데이터 필터링
                        .map((dataItem) => (
                          <div className = 'traitText' key={dataItem.name}>
                            ({dataItem.effects.map((effect) => effect.minUnits).join('/')})
                          </div>
                        ))}
                  </div>
                </div> 
            )}
            
            {sortedData
              .filter(championData => 
                championData.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((championData) => (
                <ChampionComponent 
                  key={championData.id || championData.name}
                  data={championData} 
                  SetChampionBoxList={SetChampionBoxList} 
                  SettingChampionBoxList={SettingChampionBoxList} 
                  />
              ))}
          </div>
        );
      })}
      </div>
    ) : jobButton ? (
      <div className="championBoxSet">
        {sortedKeys.map((key) => {
          const sortedData = result[key].sort((a, b) => a.name.localeCompare(b.name)); 
          return (
            <div key={key}>
                {sortedData
                  .filter(championData => 
                    championData.name.toLowerCase().includes(searchInput.toLowerCase())
                  ).length > 0 && (
                    <div className='TraitWrap'>
                      <div className='TraitImgWrap'>
                        <img
                          src={`./traitImg/${key}.png`}
                          className='TraitImg'
                          alt='traitImg'
                        />
                      </div>
                      <div className='TraitTextWrap'>
                        {key}
                      </div>
                      <div className='EffectsWrap'>
                        {data &&
                          data
                            .filter((dataItem) => dataItem.name === key) 
                            .map((dataItem) => (
                              <div className = 'traitText' key={dataItem.name}>
                                ({dataItem.effects.map((effect) => effect.minUnits).join('/')}) 
                              </div>
                            ))}
                      </div>
                   </div>  
                )}
                
                {/* 검색 조건 추가: name에 searchInput이 포함된 챔피언만 필터링 */}
                {sortedData
                  .filter(championData => 
                    championData.name.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((championData) => (
                    <ChampionComponent 
                      key={championData.id || championData.name}
                      data={championData}
                      SetChampionBoxList={SetChampionBoxList}
                      SettingChampionBoxList={SettingChampionBoxList}
                      />
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
          <ChampionComponent 
            key={championData.id || championData.name}
            data={championData} 
            SetChampionBoxList={SetChampionBoxList} 
            SettingChampionBoxList={SettingChampionBoxList} 
          />
          ))
      }
    </div>
    )}
      </div>
  </div>
      );
};

export default ChampionBox;
