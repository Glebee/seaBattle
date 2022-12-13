import React, { useState } from "react";  
import CellComponent from "./CellComponent";

const BoardComponent = ({board, setBoard, shipsReady, isMyBoard, canShoot, shoot, amount, setAmount}) => {
    
    const boardClasses = ['board'];
    if (canShoot) {
        boardClasses.push('active-shoot')
    }

    function addMark(x, y) {
        console.log(x, y);
        if (!shipsReady && isMyBoard && (amount < 20)) {
            board.addShip(x, y);
            setAmount(amount + 1);
            console.log(amount);
        } else if (canShoot && !isMyBoard) {
            shoot(x, y);
        }
        updateBoard();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div className={boardClasses.join(' ')}>
            {board.cells.map((row, index)=> 
                <React.Fragment key={index}>
                    {row.map(cell => 
                        <CellComponent key={cell.id} cell={cell} addMark={addMark}/>
                    )}
                </React.Fragment>
            )}
        </div>
    )
}

export default BoardComponent;