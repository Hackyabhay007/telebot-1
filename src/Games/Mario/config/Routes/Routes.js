import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  Birds,
  Bricks,
  Clouds,
  Mario,
  Obstacles,
  Sun,
  KeyMessage,
  LoadingScreen,
  Score,
  MobileControls,
  Footer,
  DiePopup,
  Moon,
} from "../../components";
import { CoinContext } from "../../../../Utils/coinContext";
import {
  getBoosts,
  deductBoost,
  getBoostQuantity,
} from "../../../../components/boostUtil";
import { setDie, setScore, resetScore } from "../redux/engineSlice";
import DeathPopup from "./DeathPopup";
import coin from "../../assets/img/sun.png";
import {
  BackButton,
  MainButton,
  useShowPopup,
  WebAppProvider,
} from "@vkruglikov/react-telegram-web-app";

function Home() {
  const isDie = useSelector((state) => state.engine.die);
  const score = useSelector((state) => state.engine.score);
  const dispatch = useDispatch();
  const { updateCoinValue, coinValue } = useContext(CoinContext);
  const [obstaclesHidden, setObstaclesHidden] = useState(false);
  const [noObstacleBoostTimer, setNoObstacleBoostTimer] = useState(null);
  const [level, setLevel] = useState(1); // State for the current level

  const navigate = useNavigate();

  // useEffect(() => {
  //     TelegramWebApps.init('1.1');

  //     TelegramWebApps.onEvent('back_button_pressed', () => {
  //        // navigate('/games');
  //     });
  //   }, []);

  const boosts = getBoosts()["MarioRun"] || [];

  const handleDoubleCoinsBoost = () => {
    const doubleCoinsBoostQuantity = getBoostQuantity("MarioRun", 3);
    if (doubleCoinsBoostQuantity > 0 && deductBoost("MarioRun", 3)) {
      dispatch(setScore(score));
    } else {
      // Boost usage failed
    }
  };

  const handleNoObstacleBoost = () => {
    const noObstacleBoostQuantity = getBoostQuantity("MarioRun", 4);
    if (noObstacleBoostQuantity > 0 && deductBoost("MarioRun", 4)) {
      setObstaclesHidden(true);
      setNoObstacleBoostTimer(10); // Set the timer to 10 seconds
      const timer = setInterval(() => {
        setNoObstacleBoostTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setObstaclesHidden(false);
        setNoObstacleBoostTimer(null);
      }, 10000);
    } else {
      // Boost usage failed
    }
  };

  useEffect(() => {
    return () => {
      if (noObstacleBoostTimer) {
        clearInterval(noObstacleBoostTimer);
      }
    };
  }, [noObstacleBoostTimer]);

  const handleDie = () => {
    updateCoinValue(coinValue + Math.floor(score));
    dispatch(setDie(true));
  };

  useEffect(() => {
    if (isDie) {
      handleDie();
    }
  }, [isDie, updateCoinValue, coinValue, dispatch]);

  useEffect(() => {
    const levelTimer = setInterval(() => {
      setLevel((prevLevel) => prevLevel + 1);
    }, 29000); // Update the level every 10 seconds

    return () => clearInterval(levelTimer); // Clear the interval when component unmounts
  }, []);
  

  
  return (
    <>
      <WebAppProvider>
        <div className="container mx-auto overflow-hidden px-4 sm:px-6 lg:px-8 py-8 ">
          {!isDie && (
            <div className="flex items-center justify-center text-sm">
              <div className=" rounded-lg  border-golden w-full  flex backdrop-blur-md bg-white/20">
                {
                  <div className="flex w-full">
                    {
                      <button
                        onClick={handleDoubleCoinsBoost}
                        className="flex items-center border hover:bg-golden/50 hover:border hover:border-golden border-white justify-center  text-white font-bold py-2 px-2 rounded-lg m-2 w-1/2"
                      >
                        <img src={coin} alt="Coin" className="h-6 w-6 mr-1" />
                        Double Coins : {getBoostQuantity("MarioRun", 3)}
                      </button>
                    }
                    {
                      <button
                        onClick={handleNoObstacleBoost}
                        className="flex items-center justify-center border border-white hover:bg-golden/50 hover:border hover:border-golden text-white font-bold py-2 px-2 rounded-lg m-2 w-1/2"
                      >
                        <img src={coin} alt="Coin" className="h-6 w-6 mr-2" />
                        No Obstacle: {getBoostQuantity("MarioRun", 4)}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          )}
          <div
            className={`transition-all duration-5000 App lg:w-1/2 ${
              level % 2 !== 0 ? "bgsky" : "bgnight"
            }`}
          >
            {/* {!isPlay && <KeyMessage />} */}
            {level % 2 !== 0 ? (
              <>
                <Sun />
                <Clouds />
              </>
            ) : (
              <>
                <Moon />
              </>
            )}
            <Birds />
            <Bricks />
            <Mario />
            {!obstaclesHidden && <Obstacles />}
            <Score />
          </div>

          <MobileControls />

          {isDie && <DeathPopup />}
        </div>
        <BackButton onClick={() => navigate("/games")} />;
      </WebAppProvider>
    </>
  );
}
export default Home;
