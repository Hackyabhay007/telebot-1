import React, { useState, useEffect, useContext, useRef } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
// import coin from "../assets/coin1.png";
import coin from "../assets/coin.webp";
import { CoinContext } from "../Utils/coinContext";
import { deductBoost, purchaseBoost } from "../components/boostUtil";
import ShareBalance from "../components/ShareBalance";
import bglight from "../assets/eclipsebg.png";
import BottomNavBar from "../components/BottomNavBar";
import { firestore } from "../Utils/remote"; // Import the firestore instance from the firebase.js file
import Loader from "../components/Loader";
import gift from "../assets/gift.png";
import flash from "../assets/flash.png";
import shuttle from "../assets/shuttle.png";
import { BackButton, WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import { UserDataContext } from "../Utils/userDataContext";
import coin1 from "../../src/assets/coin1.png";
import dollar from "../../src/assets/dollar.png";
import dailyreward from "../../src/assets/dailyreward.png";
import dailytask from "../../src/assets/dailytask.png";
import Profile from "../components/Profile";

const TapCoinGame = () => {
  const [score, setScore] = useState(1500);
  const [tapEffect, setTapEffect] = useState(false);
  const [doubleCoinActive, setDoubleCoinActive] = useState(false);
  const [tenXCoinActive, setTenXCoinActive] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetTimer, setResetTimer] = useState(60); // 1 minute timer
  const { incrementCoin, updateCoinValue, coinValue } = useContext(CoinContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [levels, setLevels] = useState("01");

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const {
    tapPerCoin,
    setTapPerCoin,
    autoTap,
    activeBoost,
    setAutoTap,
    setCoinValue,
  } = useContext(CoinContext);

  const { updateBoostLimit, userData } = useContext(UserDataContext);

  console.log(userData);
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
      const userProgress = await firestore
        .collection("userProgress")
        .doc(localStorage.getItem("chatId"))
        .get();
      const currentTime = Date.now();

      if (userProgress.exists) {
        const { timestamp, score } = userProgress.data();
        const elapsedSeconds = Math.floor((currentTime - timestamp) / 1000); // Calculate elapsed time in seconds
        const updatedScore = Math.min(1500, score + elapsedSeconds); // Calculate the updated score

        await firestore
          .collection("userProgress")
          .doc(localStorage.getItem("chatId"))
          .set({
            timestamp: currentTime, // Store the current timestamp for the next calculation
            score: updatedScore,
          });

        setScore(updatedScore);
      } else {
        await firestore
          .collection("userProgress")
          .doc(localStorage.getItem("chatId"))
          .set({ timestamp: currentTime, score: 500 });
        setScore(1500);
      }
    };

    fetchProgress();

    const interval = setInterval(() => {
      setScore((prevScore) => {
        const newScore = Math.min(prevScore + 1, 1500);
        setScore(newScore);
        firestore
          .collection("userProgress")
          .doc(localStorage.getItem("chatId"))
          .set({ timestamp: Date.now(), score: newScore }); // Save progress
        return newScore;
      });
    }, 2 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
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

      if (tapPerCoin > score) {
        updateCoinValue(coinValue + score);
        setScore(0);
      } else {
        setScore((prevScore) => prevScore - tapPerCoin);
        updateCoinValue(coinValue + tapPerCoin);
      }
    }

    // Save score to Firebase
    firestore
      .collection("userProgress")
      .doc(localStorage.getItem("chatId"))
      .set({
        timestamp: Date.now(),
        score: score - coinIncrement <= 0 ? 0 : score - coinIncrement,
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

  const stopAutoTap = () => {
    setAutoTap(false);
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    updateCoinValue(coinValue);
  };

  const handleTap = () => {
    setTapEffect(true);
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 150);

    setTimeout(() => {
      setTapEffect(false);
    }, 100);

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

      setCoinValue((prevScore) => prevScore + tapPerCoin);
    }
  };

  const autoTapHandler = () => {
    if (score == 0) {
      return;
    }

    intervalRef.current = setInterval(handleTap, 50); // Adjust the interval as needed
    timeoutRef.current = setTimeout(stopAutoTap, 5000);
  };

  useEffect(() => {
    if (autoTap) {
      autoTapHandler();
    }
  }, []);

  // const stopAutoTap = () => {
  //   setAutoTap(false);
  //   clearInterval(intervalRef.current);
  //   clearTimeout(timeoutRef.current);
  //   updateCoinValue(coinValue);
  // };

  // const handleTap = () => {
  //   setTapEffect(true);
  //   setIsShaking(true);

  //   setTimeout(() => {
  //     setIsShaking(false);
  //   }, 150);

  //   setTimeout(() => {
  //     setTapEffect(false);
  //   }, 100);

  //   let coinIncrement = 1;

  //   if (doubleCoinActive) {
  //     coinIncrement = 2;
  //   }
  //   if (tenXCoinActive) {
  //     coinIncrement = 10;
  //   }

  //   setScore((prevScore) => {
  //     const newScore = prevScore - tapPerCoin;
  //     if (newScore <= 0) {
  //       setShowResetPopup(true);
  //       stopAutoTap();
  //       return 0;
  //     }
  //     return newScore;
  //   });

  //   setCoinValue((prevScore) => prevScore + tapPerCoin);
  // };

  // const autoTapHandler = () => {
  //   if (score === 0) {
  //     return;
  //   }

  //   intervalRef.current = setInterval(handleTap, 50);
  //   timeoutRef.current = setTimeout(stopAutoTap, 5000);
  // };

  // useEffect(() => {
  //   if (autoTap) {
  //     autoTapHandler();
  //   }
  // }, [autoTap, score]);

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }

  const handleCardClick = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    if (score <= 0) {
      setShowResetPopup(true);
    } else {
      if (tapPerCoin > score) {
        updateCoinValue(coinValue + score);
        setScore(0);
      } else {
        setScore((prevScore) => prevScore - tapPerCoin);
        updateCoinValue(coinValue + tapPerCoin);
      }
    }

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };
  const handleAnimationEnd = (id) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  return (
    <WebAppProvider>
      <div
        className=" min-h-screen  overflow-hidden   flex flex-col justify-start mt-10  bg-custom-gradient-tapgame text-white font-display chakra-petch-bold  "
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <div className="mx-4">
            <Profile />
          </div>
          {/* levels */}
          <div className="flex  justify-between  bg-[#FFFFE5] text-black   shadow-md mx-3 px-2 border-orange-400 border rounded-xl py-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-20">Level -{levels}</div>
              <div className="w-[60vw] ">
                <div className="h-4 bg-orange-500 rounded-lg ">
                  <div
                    className="h-full bg-[#FDCD45] rounded-lg"
                    style={{ width: `${(coinValue / 50000) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <svg
                  className="h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </div>
              {/* 
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
                )} */}
            </div>
          </div>

          {/* daily reward */}
          <div className="flex">
            <div
              onClick={() => navigate("/dailyrewards")}
              className="mx-2 shadow-md  p-2 flex flex-col items-center border-2 rounded-xl border-[#F9C399] text-black"
            >
              <img src={dailyreward} alt="" className="h-8 w-8" />
              <div>Daily Reward</div>
            </div>
            <div
              onClick={() => navigate("/tasks")}
              className="mx-2 shadow-md  p-2 flex flex-col items-center border-2 rounded-xl border-[#F9C399] text-black"
            >
              <img src={dollar} alt="" className="h-8 w-8" />
              <div>Daily Coins</div>
            </div>
            <div
              onClick={() => navigate("/tasks")}
              className="mx-2 shadow-md  p-2 flex flex-col items-center border-2 rounded-xl border-[#F9C399] text-black"
            >
              <img src={dailytask} alt="" className="h-8 w-8" />
              <div>Daily Task</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img src={dollar} alt="" className="h-10 w-10" />
              <div className="text-black text-2xl">{coinValue}</div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0 w-full   h-[70%] rotate-12 bg-no-repeat bg-gradient-to-l from-transparent to-golden filter opacity-70 blur-2xl"></div>
          <div className="absolute right-0 w-full   h-[70%] rotate-12 bg-no-repeat bg-gradient-to-l from-golden to-transparent filter opacity-70 blur-2xl"></div>

          <div
            className={` coin-container flex  justify-center w-full  transform `}
          >
            <img src={coin1} onClick={handleCardClick} />
          </div>
        </div>

        <div className=" mx-4">
          <div className="flex  items-center justify-between mb-2">
            <div className="flex  items-center space-x-2">
              <div>
                <img src={flash} className="h-8" alt="" />
              </div>
              <p className="text-xl text-black ">
                <span className="text-2xl">{score}</span>/1500
              </p>
            </div>

            {/* boost button  */}
            <div className="rounded-lg flex justify-center  px-2 space-x-1 bg-[#F9C399] border-[#FA650F] border shadow-custom  shadow-[#FA650F]">
              <div>
                <img src={shuttle} className="h-10" alt="" />
              </div>
              <button
                className=" text-black text-xl"
                onClick={() => {
                  navigate("/boost");
                }}
              >
                Boost
              </button>
            </div>
          </div>

          {/* progres bar  */}
          <div className="w-full border-orange-500 border-2  rounded-lg ">
            <div className="h-4 bg-orange-500 rounded-lg">
              <div
                className="h-full bg-[#FDCD45] rounded-lg"
                style={{ width: `${(score / 1500) * 100}%` }}
              ></div>
            </div>
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

        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: `float 1s ease-out`,
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            +{tapPerCoin}
          </div>
        ))}
      </div>
      <BackButton onClick={() => navigate("/games")} />;
    </WebAppProvider>
  );
};

export default TapCoinGame;
