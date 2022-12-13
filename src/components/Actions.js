import React from "react";  

const Actions = ({shipsReady = false, canShoot = false, ready, amount}) => {
    console.log(shipsReady);
    
    // if (!shipsReady) {
    //     return <button className="btn-ready" onClick={ready}>Корабли готовы</button>
    // }
    amount < 20 ? <p>Расставьте корабли</p> : (!shipsReady) ? 
    <button className="btn-ready" onClick={ready}>Корабли готовы</button>
 : canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>
  return (
      <div>
        {/* {canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>} */}
        {amount < 20 ? <p>Расставьте корабли</p> : (!shipsReady) ? 
    <button className="btn-ready" onClick={ready}>Корабли готовы</button>
 : canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}
      </div>
  )
}

export default Actions;