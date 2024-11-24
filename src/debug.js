const [championList, setChampionList] = useState([])
const [searchInput, setSearchInput] = useState(''); 

const ChampionBox = () => {
    const ChampionBoxNameButton = () => {
        return(
        <div className='buttonWrap'>
            <button onClick={relocationChampionName}>이름순</button>
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

    const handleInputChange = (value) => {
        setSearchInput(value);
      };

  return (
    
      <div className='championBoxTool'>
        <ChampionBoxNameButton
          championList={championList}/>
          <ChampionBoxSearchBox
          inputValue={searchInput}   // 부모 컴포넌트의 상태를 props로 전달
          onInputChange={handleInputChange} // input 값 변경 시 부모로 전달하는 함수
        />
        <div className="set3-container">
        {championList.map(championData => (
        <ChampionComponent data = {championData}/>
        ))} 
        </div>
        </div>
        
)}