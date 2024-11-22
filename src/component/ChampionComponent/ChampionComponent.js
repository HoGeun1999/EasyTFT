import { useState } from "react";
import './ChampionComponent.css';

const ChampionComponent = (championData) => {
    // 마우스를 올리면 세부 정보를 보여줄지 결정하는 상태
    const [showChampionInfo, setShowChampionInfo] = useState(false);
    const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });

    // 마우스가 ChampionComponent 위에 올라갔을 때 세부정보 표시
    const handleMouseEnter = (event) => {
        setShowChampionInfo(true);
        // 마우스 위치로 세부 정보의 위치 설정 (컴포넌트 옆으로 띄우기 위해)
        const rect = event.target.getBoundingClientRect();  // 요소의 위치와 크기
        setInfoPosition({
            x: rect.right + 10, // 컴포넌트 오른쪽에 10px 간격을 두기
            y: rect.top,        // 컴포넌트의 위쪽과 동일한 위치
        });
    };

    // 마우스가 ChampionComponent 밖으로 나갔을 때 세부정보 숨기기
    const handleMouseLeave = () => {
        setShowChampionInfo(false);
    };

    const ChampionMouseOverINFO = () => {
        
        return (
            <div className="championINFO">
                {championData.data.name}
            </div>
        );
    };

    const borderClass = `cost-${championData.data.cost}`;

    return (
        <div className="championComponent">
            {championData ? (
                <div
                className={`championComponent ${borderClass}`}
                    // className={`championComponent ${borderClass}`}
                    onMouseEnter={handleMouseEnter}  // 마우스가 div 위에 들어가면 정보 표시
                    onMouseLeave={handleMouseLeave}  // 마우스가 div 밖으로 나가면 정보 숨김
                >
                    <img src={`./img/${championData.data.characterName}.png`} alt={championData.name} />
                    <p>{'$' + championData.data.cost}</p>
                    {/* {showChampionInfo && <ChampionMouseOverINFO />} */}
                </div>
            ) : (
                <p>No user found</p>
            )}
            <div
             >
                
            {showChampionInfo && <ChampionMouseOverINFO />}
            </div>
        </div>
    );
};



export default ChampionComponent