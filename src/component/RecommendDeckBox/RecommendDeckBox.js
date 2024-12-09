import { useEffect, useState } from "react";
import { deckList } from "./RecommendDeckList"; // 덱 리스트 가져오기
import ChampionComponent from "../ChampionComponent/ChampionComponent"; // 챔피언 컴포넌트 가져오기
import "./RecommendDeck.css";

const RecommendDeckBox = ({ SetChampionBoxList, SettingChampionBoxList }) => {
    const [championData, setChampionData] = useState([]); // 챔피언 데이터를 저장할 상태
    const [originalDeckList, setOriginalDeckList] = useState({}); // 초기 덱 리스트 저장
    const [updatedDeckList, setUpdatedDeckList] = useState({}); // 필터링된 덱 리스트
    const [isRecommendMode, setIsRecommendMode] = useState(false); // 추천 덱 모드 여부

    // TFTchampionData.json에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchChampionData = async () => {
            try {
                const response = await fetch("/TFTchampionData.json"); // public 폴더에서 파일을 가져옴
                if (response.ok) {
                    const data = await response.json();
                    setChampionData(data); // championData 상태에 저장
                } else {
                    console.error("챔피언 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("파일을 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchChampionData();
    }, []);

    // 데이터를 가져온 후 deckList를 업데이트
    useEffect(() => {
        if (championData.length > 0) {
            const initialDeckList = {};
            Object.keys(deckList).forEach((deckName) => {
                const championList = deckList[deckName].map((unitName) => {
                    const champion = championData.find((champ) => champ.name === unitName);
                    return champion || unitName; // champion 객체 또는 원래 이름
                });
                initialDeckList[deckName] = championList;
            });
            setOriginalDeckList(initialDeckList);
            setUpdatedDeckList(initialDeckList); // 초기값 저장
        }
    }, [championData]);

    // `SetChampionBoxList` 변경 감지 및 추천 덱 필터링
    useEffect(() => {
        if (isRecommendMode) {
            const filteredDeckList = {};

            Object.keys(originalDeckList).forEach((deckName) => {
                const championList = originalDeckList[deckName];
                let matchCount = 0;

                championList.forEach((champion) => {
                    const championName = typeof champion === "object" ? champion.name : champion;

                    // `SetChampionBoxList`를 순회하며 이름 비교
                    const isMatched = SetChampionBoxList.some(
                        (selectedChampion) => selectedChampion.name === championName
                    );

                    if (isMatched) {
                        matchCount++;
                    }
                });

                // 매칭된 챔피언이 5개 이상인 덱만 추가
                if (matchCount >= 5) {
                    filteredDeckList[deckName] = championList;
                }
            });

            setUpdatedDeckList(filteredDeckList); // 필터링된 리스트 업데이트
        }
    }, [SetChampionBoxList, isRecommendMode]); // `SetChampionBoxList` 또는 `isRecommendMode` 변경 시 실행

    // 추천 덱 버튼 핸들러
    const onClickRecommendDeckButton = () => {
        setIsRecommendMode(true);
    };

    // 메타 덱 버튼 핸들러
    const onClickDeckListButton = () => {
        setIsRecommendMode(false);
        setUpdatedDeckList(originalDeckList); // 초기 상태로 복원
    };

    return (
        <div className="RecommendDeckBox">
            <div className="RecommendDeckBoxBtn">
                <div className="deckListButton">
                    <button onClick={onClickDeckListButton}>메타덱</button>
                </div>
                <div className="deckListButton">
                    <button onClick={onClickRecommendDeckButton}>추천덱</button>
                </div>
            </div>
            {Object.keys(updatedDeckList).length > 0 ? (
                Object.keys(updatedDeckList).map((deckName, i) => (
                    <div key={i} className="deck">
                        <h3>{deckName}</h3>
                        <div className="champion-list">
                            {updatedDeckList[deckName].map((champion, j) => {
                                const championName = typeof champion === "object" ? champion.name : champion;
    
                                // 데이터가 안 겹치는지 확인 (추천 덱 모드일 때만 적용)
                                const isNotMatched =
                                    isRecommendMode &&
                                    !SetChampionBoxList.some(
                                        (selectedChampion) => selectedChampion.name === championName
                                    );
    
                                // 안 겹치는 경우에만 className에 "not-matched" 추가
                                const championClass = isNotMatched ? "champion not-matched" : "champion";
    
                                return (
                                    <ChampionComponent
                                        key={j}
                                        data={champion}
                                        SetChampionBoxList={SetChampionBoxList}
                                        SettingChampionBoxList={SettingChampionBoxList}
                                        className={championClass} // 조건부 클래스 추가
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <p>추천할 덱이 없습니다.</p>
            )}
        </div>
    );
};

export default RecommendDeckBox;
