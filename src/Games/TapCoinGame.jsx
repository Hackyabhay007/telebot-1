import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
// import coin from "../assets/coin1.png";
import coin from "../assets/coin.webp";
import { CoinContext } from "../Utils/coinContext";
import {
  deductBoost,
  purchaseBoost,
} from "../components/boostUtil";
import ShareBalance from "../components/ShareBalance";
import bglight from "../assets/eclipsebg.png";
import BottomNavBar from "../components/BottomNavBar";
import { firestore } from "../Utils/remote"; // Import the firestore instance from the firebase.js file
import Loader from "../components/Loader";
import gift from "../assets/gift.png";
import flash from "../assets/flash.png";
import shuttle from "../assets/shuttle.png"
import { BackButton, WebAppProvider } from "@vkruglikov/react-telegram-web-app";

const TapCoinGame = () => {
  const [score, setScore] = useState(1500);
  const [tapEffect, setTapEffect] = useState(false);
  const [doubleCoinActive, setDoubleCoinActive] = useState(false);
  const [tenXCoinActive, setTenXCoinActive] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetTimer, setResetTimer] = useState(60); // 1 minute timer
  const { incrementCoin, updateCoinValue, coinValue } = useContext(CoinContext);
  const [showBoosts1, setShowBoosts1] = useState(false);
  const [showBoosts2, setShowBoosts2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [showLevels, setShowLevels] = useState(false);

  const {tapPerCoin , setTapPerCoin , autoTap ,activeBoost , setAutoTap}=useContext(CoinContext)


  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (tapPerCoin > 1) {
      timer = setTimeout(() => {
        setTapPerCoin(1);
      }, 60000); // 3000 milliseconds = 3 seconds
    }

    return () => clearTimeout(timer);
  }, [tapPerCoin]);
 
  useEffect(() => {
    const fetchProgress = async () => {
      const userProgress = await firestore.collection('userProgress').doc(localStorage.getItem("chatId")).get();
      const currentTime = Date.now();

      if (userProgress.exists) {
        const { timestamp, score } = userProgress.data();
        const elapsedSeconds = Math.floor((currentTime - timestamp) / 1000); // Calculate elapsed time in seconds
        const updatedScore = Math.min(1500, score + elapsedSeconds); // Calculate the updated score

        await firestore.collection('userProgress').doc(localStorage.getItem("chatId")).set({
          timestamp: currentTime, // Store the current timestamp for the next calculation
          score: updatedScore,
        });
        
        console.log(updatedScore)
        setScore(updatedScore);
      } else {
        await firestore.collection('userProgress').doc(localStorage.getItem("chatId")).set({ timestamp: currentTime, score: 500 });
        setScore(1500);
      }
    };

    fetchProgress();

    const interval = setInterval(() => {
      setScore((prevScore) => {
        const newScore = Math.min(prevScore + 1, 1500);
        setScore(newScore);
        firestore.collection('userProgress').doc(localStorage.getItem("chatId")).set({ timestamp: Date.now(), score: newScore }); // Save progress
        return newScore;
      });
    }, 2 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setTapEffect(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 50);

    setTimeout(() => {
      setTapEffect(false);
    }, 400);

    let coinIncrement = 1;

    if (score <= 0) {
      setShowResetPopup(true);
    } else {
      if (doubleCoinActive) {
        coinIncrement = 2;
      }
      if (tenXCoinActive) {
        coinIncrement = 10;
      }
      setScore((prevScore) => prevScore - tapPerCoin);
      updateCoinValue(coinValue + tapPerCoin);
    }

    // Save score to Firebase
    firestore.collection('userProgress').doc(localStorage.getItem("chatId")).set({
      timestamp: Date.now(),
      score: (score - coinIncrement) <= 0 ? 0 : (score - coinIncrement),
    });
  };


  useEffect(() => {
    let resetInterval;
    if (showResetPopup) {
      resetInterval = setInterval(() => {
        setResetTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(resetInterval);
  }, [showResetPopup]);



  const autoTapHandler=() =>{
    function tap() {
      console.log("Tap!"); 
    }
      const durationInMilliseconds = 5000;
  
    const intervalId = setInterval(tap, durationInMilliseconds);
  
    // Stop tapping after the specified duration
    setTimeout(() => {
      clearInterval(intervalId); // Stop the interval
      console.log("Auto tap stopped.");
    }, durationInMilliseconds);
  }


  if(autoTap){
    console.log("Insie autpttewtr")
    autoTapHandler()
    setAutoTap(false)
  }

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }



  return (
    <WebAppProvider>
      <div
        className=" min-h-screen  overflow-hidden   flex flex-col justify-start i  bg-custom-gradient-tapgame text-white font-display chakra-petch-bold  "
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      >
        <div className="mt-8 space-y-8">
          {/* levels */}

          <div className="relative flex">
            <h1
              onClick={() => {
                setShowLevels(!showLevels);
              }}
              className="cursor-pointerpointer flex gap-7 justify-between rounded-r-xl bg-[#FFFFE5] text-black px-5  py-1 shadow-md"
            >
              <span className="flex items-center space-x-1">
                <span> Level</span>
                {!showLevels ? (
                  <span>
                    <svg
                      className="h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                    </svg>
                  </span>
                ) : (
                  <span>
                    <svg
                      className="h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                    </svg>
                  </span>
                )}
              </span>
              <span>1/18</span>
            </h1>
            {showLevels && (
              <div className="absolute top-8 left-12 bg-red-200">
                Levels PoPUP
              </div>
            )}
          </div>

          {/* daily reward */}
          <div className="flex">
            <div
              onClick={() => navigate("/tasks")}
              className="mx-2 shadow-md px-6 py-2 flex flex-col items-center border-2 rounded-xl bg-[#FFFFE5] text-black"
            >
              <img src={gift} alt="" className="h-8 w-8" />
              <div>Daily Reward</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {/* <ShareBalance view={1} /> */}
            <div className="flex items-center space-x-2">
              <div>
                <img src={coin} alt="" className="h-10 w-10" />
              </div>
              <div className="text-black text-2xl">{coinValue}</div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-full flex items-center justify-center mb-20">
          <div className="absolute left-0 w-full   h-[70%] rotate-12 bg-no-repeat bg-gradient-to-l from-transparent to-golden filter opacity-70 blur-2xl"></div>
          <div className="absolute right-0 w-full   h-[70%] rotate-12 bg-no-repeat bg-gradient-to-l from-golden to-transparent filter opacity-70 blur-2xl"></div>

          <div
            onClick={(event) => {
              handleClick(event);
              setIsShaking(true);
            }}
            className={` coin-container flex  justify-center w-full  transform `}
          >
            <img
              src={coin}
              alt="coin"
              className={` w-[60%] h-auto ${isShaking ? "animate-shake" : ""}`}
            />
            {tapEffect && (
              <div
                className="tap top-20 absolute text-3xl  mr"
                style={{ animation: "float 0.9s " }}
              >
                {doubleCoinActive && tenXCoinActive
                  ? "+12"
                  : tenXCoinActive
                  ? "+10"
                  : doubleCoinActive
                  ? "+2"
                  : "+"+tapPerCoin}
              </div>
            )}
          </div>
        </div>

        <div className="flex  items-center justify-between mx-4">

          <div className="flex  items-center space-x-2">
            <div>
              <img src={flash} className="h-8" alt="" />
            </div>
            <p className="text-2xl text-black mb-2">{score}/1500</p>
            {/* <div className="w-full bg-gray-200 rounded-lg border border-golden bg-transparent overflow-hidden p-1">
              <div className="h-1 bg-white rounded-lg">
                <div
                  className="h-full bg-[#FFFFE5] rounded-lg"
                  style={{ width: `${(score / 500) * 100}%` }}
                ></div>
              </div>
            </div> */}
          </div>

          <div className=" flex justify-center space-x-2">
            <div>
              <img src={shuttle} className="h-8" alt="" />
            </div>
            <button className=" text-black text-2xl"
              onClick={()=>{
                navigate('/boost')
              }}
            >
              Boost
            </button>
          </div>
        </div>
        {showResetPopup && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center">
            <div className=" backdrop-blur-md  bg-golden/10    border-2 border-golden p-8 rounded-lg m-16 shadow-lg text-white">
              <h2 className="text-2xl font-bold mb-4 text-black">Wait!</h2>
              <p className="mb-4  text-black">
                Your score has reached 0. You can try again in Some Time
              </p>
              <button
                className="bg-golden text-black px-4 py-2 rounded-full"
                onClick={() => setShowResetPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
      <BackButton onClick={() => navigate("/games")} />;
    </WebAppProvider>
  );
};

export default TapCoinGame;
