import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball';
import './style.css';

function getWinNumbers() {
    console.log("shuffle");
    const candidate = Array(45).fill().map((v,i) => i+1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }

    const bonusNumber = shuffle[shuffle.length -1];
    const winNumbers = shuffle.slice(0,6).sort((p,c)=> p-c);
    return [...winNumbers, bonusNumber];
}

const App4 = () => {
    // hooks는 조건문 안에 절대 넣으면 안되고 함수나 반복문 안에도 웬만하면 넣으면 안된다.(실행순서들이 중요하다)

    // useCallback : 함수 자체를 기억함 (나중에 사용할때 함수 자체를 기억해서 실행될때 처음에만 생성하고 다음엔 새로 생성되지가않는다)
    // useMemo : 복잡한 함수 *결과값(return값)을 기억할때 사용 (계속 호출되는걸 막을수 있다)    []값이 바뀌기 전까지 값을 기억한다. 
    // useRef : 일반적인 값을 기억할때 사용
    const lottoNumbers = useMemo(()=> getWinNumbers(), []);
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);



    // [] 이게 빈배열이면 componentDidMount랑 똑같음.
    // 배열에 요소가 있으면 componentDidMount랑 componentDidUpdate 둘다 수행
    useEffect(()=> {
        for(let i = 0; i < winNumbers.length - 1; i++) {
            timeouts.current[i] = setTimeout(()=> {
                setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]])
            }, ( i + 1 ) * 1000);
        }

        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000)

        // 리턴이 componentWillUnmount
        return () => {
            timeouts.current.forEach((v)=> {
                clearTimeout(v);
            })
        }

    }, [timeouts.current])


    // 자식 컴포넌트한테 함수를 넘길떄(props로)는 useCallback으로 꼭 넘겨주어야한다.
    const onClickRedo = useCallback(() => {
        console.log("onClickRedo");
        console.log(winNumbers);
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = []; 
    }, [winNumbers])

    return (
        <div>
                <div>당첨숫자</div>
                <div id="결과창">
                    {winBalls.map((v) => <Ball key={v} number={v} />)}
                </div>
                <div>보너스</div>
                {bonus && <Ball number={bonus}/>}
                <div>
                {redo && <button onClick={redo && onClickRedo} >한번 더!</button>}         
                </div>
        </div>
    )
}

export default App4;


// import React, { Component } from 'react';
// import Lotto from './Lotto'

// class App4 extends Component {
//     render() {
//         return (
//             <div>
//                 <Lotto />
//             </div>
//         );
//     }
// }

// export default App4;