import { useEffect, useState } from "react";
import ChampionComponent from "../ChampionComponent/ChampionComponent"; 
import "./RecommendDeckBox.css";

const RecommendDeckBox = ({ SetChampionBoxList, SettingChampionBoxList }) => {
    const [championData, setChampionData] = useState([]); 
    const [originalDeckList, setOriginalDeckList] = useState({}); 
    const [firstDeckList, setFirstDeckList] = useState([]); 
    const [updatedDeckList, setUpdatedDeckList] = useState({}); 
    const [isRecommendMode, setIsRecommendMode] = useState(false); 
    const [activeButton, setActiveButton] = useState("meta"); 

    // TFTchampionData.json에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchChampionData = async () => {
            try {
                const response = await fetch("/TFTchampionData.json"); 
                if (response.ok) {
                    const data = await response.json();
                    setChampionData(data); 
                } else {
                    console.error("챔피언 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("파일을 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchChampionData();
    }, []);

    // metaDeck.json 데이터를 가져오기 위한 useEffect
    useEffect(() => {
        const fetchMetaDeckList = async () => {
            try {
                const response = await fetch("/metaDeck.json");
                if (response.ok) {
                    const data = await response.json();
                    const processedDeckList = {};

                    Object.keys(data).forEach((deckName) => {
                        const championList = data[deckName].map((unitName) => {
                            const champion = championData.find((champ) => champ.name === unitName);
                            return champion || unitName; 
                        });
                        processedDeckList[deckName] = championList;
                    });
                    setOriginalDeckList(processedDeckList);
                    setUpdatedDeckList(processedDeckList); 
                } else {
                    console.error("metaDeck 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("metaDeck.json 파일을 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        if (championData.length > 0) {
            fetchMetaDeckList();
        }
    }, [championData]);

    // firstDeckList.json 데이터를 가져오기 위한 useEffect
    useEffect(() => {
        const fetchFirstDeckList = async () => {
            try {
                const response = await fetch("/firstDeckList.json"); 
                if (response.ok) {
                    const data = await response.json();
                    setFirstDeckList(data); 
                } else {
                    console.error("firstDeckList 데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("firstDeckList.json 파일을 가져오는 중 오류가 발생했습니다:", error);
            }
        };
        fetchFirstDeckList();
    }, []);

    
    useEffect(() => {
        if (isRecommendMode) {
            const filteredDeckList = {};
    
            // Step 1: originalDeckList에서 5개 이상 매칭된 덱 추가
            Object.keys(originalDeckList).forEach((deckName) => {
                const championList = originalDeckList[deckName];
                let matchCount = 0;
    
                championList.forEach((champion) => {
                    const championName = typeof champion === "object" ? champion.name : champion;
    
                    // SetChampionBoxList와 매칭되는 챔피언 수 체크
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
    
            // Step 2: firstDeckList에서 매칭된 덱 찾기 및 매칭 수 계산
            const matchedFirstDecks = [];
            firstDeckList.forEach((firstDeck) => {
                const championList = firstDeck.map((championName) => {
                    // 이름을 기반으로 championData에서 챔피언 객체 찾기
                    const champion = championData.find((champ) => champ.name === championName);
                    return champion || championName; // 매칭되면 객체, 아니면 원래 이름 반환
                });
    
                let matchCount = 0;
                championList.forEach((champion) => {
                    const championName = typeof champion === "object" ? champion.name : champion;
    
                    // SetChampionBoxList와 매칭되는 챔피언 수 체크
                    const isMatched = SetChampionBoxList.some(
                        (selectedChampion) => selectedChampion.name === championName
                    );
    
                    if (isMatched) {
                        matchCount++;
                    }
                });
    
                // 매칭된 챔피언이 5개 이상인 덱 저장 (챔피언 리스트와 매칭 수 저장)
                if (matchCount >= 5) {
                    matchedFirstDecks.push({ matchCount, championList });
                }
            });
    
            // Step 3: 겹치는 수 기준으로 정렬 (내림차순)
            matchedFirstDecks.sort((a, b) => b.matchCount - a.matchCount);
    
            // Step 4: 우선순위에 따라 덱 선택
            const prioritizedDecks = [];
            const maxDecks = 5;
    
            // 먼저 가장 많이 겹치는 덱을 선택
            matchedFirstDecks.forEach((deck) => {
                if (prioritizedDecks.length < maxDecks) {
                    prioritizedDecks.push(deck.championList);
                }
            });
    
            // 랜덤으로 선택할 필요가 있다면 남은 덱에서 추가
            if (prioritizedDecks.length < maxDecks) {
                const remainingDecks = matchedFirstDecks.slice(prioritizedDecks.length);
                const randomIndexes = new Set();
    
                while (
                    prioritizedDecks.length < maxDecks &&
                    randomIndexes.size < remainingDecks.length
                ) {
                    const randomIndex = Math.floor(Math.random() * remainingDecks.length);
                    if (!randomIndexes.has(randomIndex)) {
                        randomIndexes.add(randomIndex);
                        prioritizedDecks.push(remainingDecks[randomIndex].championList);
                    }
                }
            }
    
            // Step 5: filteredDeckList에 "최근1위덱"으로 추가
            prioritizedDecks.forEach((deck, index) => {
                filteredDeckList[`최근1위덱 (${index + 1})`] = deck;
            });
    
            setUpdatedDeckList(filteredDeckList);
        }
    }, [SetChampionBoxList, isRecommendMode, originalDeckList, firstDeckList, championData]);
    
    
    const onClickRecommendDeckButton = () => {
        setIsRecommendMode(true);
        setActiveButton("recommend");
        
    };

    const onClickDeckListButton = () => {
        setIsRecommendMode(false);
        setUpdatedDeckList(originalDeckList);
        setActiveButton("meta");
    };

    return (
        <div className="RecommendDeckBoxWrap">
            <div className="RecommendDeckBoxBtn">
                <div className="deckListButtonWrap">
                    <button
                        className={`deckListButton ${activeButton === "meta" ? "active" : ""}`}
                        onClick={onClickDeckListButton}
                    >
                        메타덱
                    </button>
                </div>
                <div className="deckListButtonWrap">
                    <button
                        className={`deckListButton ${activeButton === "recommend" ? "active" : ""}`}
                        onClick={onClickRecommendDeckButton}
                    >
                        추천덱
                    </button>
                </div>
            </div>
            <div className="RecommendDeckBox">
                {Object.keys(updatedDeckList).length > 0 ? (
                    Object.keys(updatedDeckList).map((deckName, i) => (
                        <div key={i} className="deck">
                            <div className="deckName">{deckName}</div>
                            <div className="champion-list">
                                {updatedDeckList[deckName].map((champion, j) => {
                                    const championName = typeof champion === "object" ? champion.name : champion;

                                    const isNotMatched =
                                        isRecommendMode &&
                                        !SetChampionBoxList.some(
                                            (selectedChampion) => selectedChampion.name === championName
                                        );

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
                    <div className="noRecommend">
                        추천할 덱이 없습니다. <br /> 더 많은 챔피언을 선택해 주세요
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendDeckBox;
