액션: 리덕스 상태를 변경하는 명령어. setData는 data를 리덕스에 저장하는 액션입니다.
리듀서: 액션을 받아서 상태를 업데이트하는 함수.
스토어: 상태를 저장하고 관리하는 저장소.
컴포넌트: useDispatch와 useSelector를 사용하여 액션을 디스패치하거나 상태를 가져옴.
useSelector = 읽기  useDispatch = 쓰기(변경)


상태를 여러 컴포넌트에서 공유하고 싶다면, 각 컴포넌트에서 useSelector를 사용하여 상태를 가져올 수 있습니다. 리덕스 상태는 전역 상태이므로 모든 컴포넌트가 동일한 데이터를 공유합니다.


리덕스에서 데이터 저장 공간을 만들기 위해서는 액션, 리듀서, 스토어를 설정하고, React 컴포넌트에서는 useSelector와 useDispatch를 사용하여 상태를 가져오거나 액션을 디스패치할 수 있습니다. 이 과정을 통해 애플리케이션의 상태를 중앙에서 관리하고, 여러 컴포넌트 간에 상태를 공유할 수 있습니다.



"관통하는 얼음 파편을 발사해 @SunderDuration@초 동안 <TFTKeyword>파열</TFTKeyword>을 적용하고 <physicalDamage>@TotalDamage@(%i:scaleAD%%i:scaleAP%)</physicalDamage>의 물리 피해를 입힙니다. 적중한 적 하나당 피해량이 @FalloffDamage*100@%씩 감소합니다. <br><br><tftitemrules><tftbold>파열:</tftbold> 방어력 감소</tftitemrules>"



챔피언박스
-------------------
버튼이랑 검색툴 css 정리하기
챔피언 컴포넌트에 마우스 올렸을때 챔피언 정보 추가하기
챔피언 클릭 이벤트 클릭한 위치에 따라 변경하기 ( 부모에 클릭하는 챔피언 위치 state 만들고 전달해가면서 값 변경하기)