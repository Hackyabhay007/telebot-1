import React, { useContext,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CoinContext } from '../../../../Utils/coinContext';
import { setDie, setScore } from '../redux/engineSlice';
import coin from "../../../../Games/Assets/coin.png";

const DeathPopup = ({ onClose }) => {
    const score = useSelector(state => state.engine.lastScore);
    const isDie = useSelector((state) => state.engine.die);
  const dispatch = useDispatch();
  const { updateCoinValue } = useContext(CoinContext);

  const handleClose = () => {
    dispatch(setDie(false));
    dispatch(setScore(0));
   
  };

  useEffect(() => {
    if (isDie) {
      handleClose();
    }
}, [isDie, dispatch]);

  const coinsEarned = Math.floor(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75  chakra-petch-bold ">
      <div className="border-golden w-4/5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg  relative border ">
      
        <h2 className="text-4xl font-bold text-center text-golden mb-4">Game Over</h2>
      
        <div className="border-golden flex w-full backdrop-blur-sm items-center justify-center bg-black/10 rounded-md">
          <img src={coin} alt="" className="h-10 mr-2 " />
            <p className="text-white chakra-petch-regular">Coins Earned : {coinsEarned}</p>
        </div>
      
       
      </div>
    </div>
  );
};

export default DeathPopup;
