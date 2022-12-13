import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Board } from "../classes/Board";
import BoardComponent from "../components/BoardComponent"
import Actions from "../components/Actions";

const wss = new WebSocket('ws://localhost:4000');

const GamePage = () => {
    const shipsAmount = 20;
    const [amount, setAmount] = useState(0);
    const {gameId} = useParams();
    const [myBoard, setMyBoard] = useState(new Board());
    const [hisBoard, setHisBoard] = useState(new Board());
    const [rivalName, setRivalName] = useState('');
    const [shipsReady, setShipsReady] = useState(false);
    const [canShoot, setCanShoot] = useState(false);

    function shoot(x, y) {
        wss.send(JSON.stringify({event: 'shoot', payload: {username: localStorage.nickname, x, y, gameId}}));
    }

    const navigate = useNavigate();

    wss.onmessage = function(response) {
        console.log(response);
        const {type, payload} = JSON.parse(response.data);
        const { username, x, y, canStart, rivalName, succes} = payload;
        switch (type) {
            case "connectToPlay":
                if (!succes) {
                    return navigate('/');
                }
                setRivalName(rivalName);
                break;
            case "readyToPlay":
                if (payload.username === localStorage.nickname && canStart) {
                    setCanShoot(true);
                }
                break;
            case "afterShootByMe":
                console.log("afterShoot", username !==localStorage.nickname);
                if (username !==localStorage.nickname) {
                    const isPerfectHit = myBoard.cells[y][x].mark?.name === 'ship';
                    changeBoardAfterShoot(myBoard, setMyBoard,x, y, isPerfectHit);
                    wss.send(JSON.stringify({event: 'checkShoot', payload: {...payload, isPerfectHit}}));
                    if (!isPerfectHit) {
                        setCanShoot(true);
                    }
                }
                break;
            case "isPerfectHit":
                if (username ===localStorage.nickname) {
                    changeBoardAfterShoot(hisBoard, setHisBoard, x, y, payload.isPerfectHit);
                    payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false);
                }
                break;
            default:
                break;

        }
    }

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x,y) : board.addMiss(x, y);
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function restart() {
        const newMyBoard = new Board();
        const newHisBoard = new Board();
        newMyBoard.initCells();
        newHisBoard.initCells();
        setMyBoard(newMyBoard);
        setHisBoard(newHisBoard);
    }

    useEffect(()=> {
        wss.send(JSON.stringify({event: "connect", payload: {username: localStorage.nickname, gameId}}));
        restart();
    }, [])

    function ready() {
        wss.send(JSON.stringify({event: 'ready', payload: {username: localStorage.nickname, gameId}}));
        setShipsReady(true);
    }

    return (
        <div>
            <p>Добро пожаловать в игру</p>
            <div className="boards-container">
                <div>
                    <p className="nick">{localStorage.nickname}</p>
                    <BoardComponent
                     board={myBoard}
                     isMyBoard
                     shipsReady = {shipsReady}
                     setBoard={setMyBoard}
                     canShoot={false}
                     amount = {amount}
                     setAmount = {setAmount}
                     />
                </div>
                <Actions ready={ready} canShoot={canShoot} shipsReady={shipsReady} amount = {amount} setAmount={setAmount}/>
                <div>
                    <p className="nick">{rivalName || "соперник неизвестен"}</p>
                    <BoardComponent 
                    board={hisBoard}
                    setBoard={setHisBoard}
                    canShoot={canShoot}
                    shipsReady={shipsReady}
                    shoot={shoot}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default GamePage;