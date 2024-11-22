import './App.css';
import ChampionBox from './component/ChampionBox/ChampionBox';
import ItemBox from './/component/ItemBox/ItemBox'
import TraitBox from './component/TraitBox/TraitBox';
import RecommendDeckBox from './component/RecommendDeckBox/RecommendDeckBox';
import SetChampionBox from './component/SetChampionBox/SetChampionBox';

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid-item-ChampionBox">
          <ChampionBox />
        </div>
        <div className="grid-item-ItemBox">
          <ItemBox />
        </div>
        <div className="grid-item-TraitBox">
          <TraitBox />
        </div>
        <div className="grid-item-RecommendDeckBox">
          <RecommendDeckBox />
        </div>
        <div className="grid-item-SetChampionBox">
          <SetChampionBox />
        </div>
      </div>
    </div>
  );
}
export default App;
