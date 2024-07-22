import React, { useState, useEffect, useContext } from "react";
import ShareBalance from "./ShareBalance";
import coin from "../Games/Assets/coin.png";
import boost1Image from "../assets/boosts/star-dynamic-premium.png";
import boost2Image from "../assets/boosts/sun-dynamic-premium.png";
import { CoinContext } from "../Utils/coinContext";
import BoostPurchasePopup from "./BoostPurchasePopup";
import NoBalancePopup from "./NoBalancePoup";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader";
import {
  getDailyBoost,
  updateBoostLimit,
  getPaidBoost,
} from "../Utils/boostCreater";
import dollar from "../../src/assets/dollar.png";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Utils/userDataContext";
import dailyBoost1 from "../../src/assets/10x.png";
import dailyBoost2 from "../../src/assets/20x .png";
import autoTap from "../../src/assets/autoTap.png";
import fiftyX from "../../src/assets/50x.png";
import flash from "../../src/assets/flash.png";

const Boost = () => {
  const {
    coinValue,
    updateCoinValue,
    setActiveBoost,
    activeBoost,
    setTapPerCoin,
    tapPerCoin,
    dailyBoost,
    setDailyBoost,
    paidBoost,
    setPaidBoost,
    setAutoTap,
    updateScore,
    setAutoTapAmount,
  } = useContext(CoinContext);

  const { updateBoostLimit, userData } = useContext(UserDataContext);

  const [selectedBoost, setSelectedBoost] = useState(null);
  const [showNoBalancePopup, setShowNoBalancePopup] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [goHead, setGoHead] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (tapPerCoin > 1) {
      timer = setTimeout(() => {
        setTapPerCoin(1);
      }, 3000); // 3000 milliseconds = 3 seconds
    }

    return () => clearTimeout(timer);
  }, [tapPerCoin]);

  useEffect(() => {
    const fetchData = async () => {
      const timer = setTimeout(() => {
        // initializeData(coinValue);
        setIsLoading(false);
      }, 500);

      try {
        const data = await getDailyBoost();
        setDailyBoost(data);
        const paidBoostData = await getPaidBoost();
        setPaidBoost(paidBoostData);
      } catch (error) {
        console.error("Error fetching daily boost:", error);
      }

      return () => clearTimeout(timer);
    };

    fetchData();
  }, []);

  // handling gohead popup for daily boost
  const goAheadFreeBoostHandler = () => {
    if (activeBoost.name == "10x") {
      setTapPerCoin(10);
      updateBoostLimit({ limit10x: userData.limit10x - 1 });
    } else {
      setTapPerCoin(20);
      updateBoostLimit({ limit20x: userData.limit20x - 1 });
    }

    setGoHead(false);
    setActiveBoost(null);
    navigate("/games");
  };

  //  handler function for free booster
  const handleUse = async (boost) => {
    if (
      (userData.limit10x > 0 && boost.id == 1) ||
      (userData.limit20x > 0 && boost.id == 2)
    ) {
      setActiveBoost(boost);
      setGoHead(true);
    }
  };

  const handleCloseNoBalancePopup = () => {
    setShowNoBalancePopup(false);
  };

  const handleClosePopup = () => {
    setSelectedBoost(null);
  };

  // handler function for buying a paid boost
  const handleBuy = (boost) => {
    console.log(boost);
    setActiveBoost(boost);
    setGoHead(true);
  };

  const goAheadPaidHandler = () => {
    updateCoinValue(coinValue - activeBoost.cost);

    if (activeBoost.name == "Full Energy") {
      console.log("INsdie full Energu");
      updateScore();
    } else if (activeBoost.name == "AutoTap") {
      setAutoTapAmount(1);
      setTapPerCoin(1);
      setAutoTap(true);

      setTapPerCoin(1);
    } else if (activeBoost.name == "10x AutoTap") {
      setAutoTapAmount(10);
      setTapPerCoin(10);
      setAutoTap(true);
    } else if (activeBoost.name == "50x AutoTap") {
      setAutoTapAmount(50);
      setTapPerCoin(50);
      setAutoTap(true);
    } else {
      setAutoTapAmount(100);
      setTapPerCoin(100);
      setAutoTap(true);
    }

    navigate("/games");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen p-10 bg-custom-gradient-tapgame">
      <div className="flex items-center justify-center py-2 ">
        <div className="text-center ">
          <h3 className="text-xl chakra-petch-medium text-black font-extrabold">
            Your Balance
          </h3>
          <div className=" flex justify-center items-center space-x-2 px-12">
            <img src={dollar} className="h-12" alt="" />

            <p className="text-4xl chakra-petch-bold ">
              {coinValue !== null ? coinValue : "Loading..."}
            </p>
          </div>
        </div>
      </div>

      <div className="text-white h-[0.09px] my-4 opacity-10 bg-white"></div>
      <h1 className="text-2xl text-black font-bold">Free Daily Booster</h1>
      <div className="">
        {dailyBoost.map((boost) => (
          <div
            key={boost.id}
            className="border-orange-400 border  flex flex-row md:flex-row items-center mb-2 rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-2 text-black"
          >
            <div className="flex justify-between flex-grow">
              <div className="flex space-x-4">
                <div className="flex justify-center items-center">
                  <img
                    src={boost.name === "10x" ? dailyBoost1 : dailyBoost2}
                    alt=""
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="">
                    <h3 className="text-lg font-bold text-black">
                      {boost.name} Boost
                      {"(" +
                        (boost.id == 1
                          ? userData.limit10x
                          : userData.limit20x) +
                        ")"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex items-center ">
                <button
                  disabled={boost.limit <= 0 ? true : false}
                  className="text-white bg-orange-400 px-4 py-1 rounded-md shadow-md font-bold"
                  onClick={() => {
                    handleUse(boost);
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 100);
                  }}
                >
                  USE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Boosters  */}
      <h1 className="chakra-petch-bold text-2xl text-black mt-4"> Booster</h1>
      <div className="">
        {paidBoost.map((boost) => (
          <div
            key={boost.id}
            className="flex  justify-between md:flex-row items-center mb-2 border border-orange-400  rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-2 text-black"
          >
            <div className="flex  flex-grow justify-between">
              <div className="flex space-x-6">
                <div
                  className={`${
                    boost.name === "AutoTap" || "Full Energy"? "" : " bg-orange-400 "
                  }flex justify-center items-center p-1 rounded-full w-9`}
                >
                  <img
                    className=""
                    src={boost.name == "AutoTap" && autoTap}
                    alt=""
                  />
                  <img
                    className=""
                    src={boost.name == "10x AutoTap" && dailyBoost1}
                    alt=""
                  />
                  <img
                    className=""
                    src={boost.name == "50x AutoTap" && fiftyX}
                    alt=""
                  />
                  {boost.name === "100x AutoTap" && <div className="text-progrerss-bar-start rounded-full font-bold text-xl tracking-tighter">100x</div>}
                  <img src={boost.name == "Full Energy" && flash} className="" alt="" />
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-black">{boost.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-end">
                {
                  <button
                    disabled={boost.limit <= 0 ? true : false}
                    className="bg-orange-400 text-white px-4 py-1 rounded-md font-bold"
                    onClick={() => handleBuy(boost)}
                  >
                    BUY
                  </button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      {goHead && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75">
        //   <div className="border-golden m-5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border">
        //     <button
        //       className="absolute top-2 right-2 text-white text-xl font-bold"
        //       onClick={() => {
        //          setActiveBoost(null)
        //          setGoHead(false)
        //       }}
        //     >
        //       &times;
        //     </button>
        //     <h2 className="text-2xl font-bold text-golden mb-4 text-center">
        //       {activeBoost?.name}
        //     </h2>
        //     <p className="text-white mb-4 chakra-petch-medium">
        //       {activeBoost?.description}
        //     </p>
        //     <div className="flex items-center justify-center mb-4">
        //       <img src={coin} alt="Coin" className="h-8 mr-2" />
        //       <p className="text-white text-xl">
        //         {activeBoost?.cost ? activeBoost.cost : "Free"}
        //       </p>
        //     </div>

        //     <div className="flex justify-center">
        //       {coinValue > activeBoost.cost ? (
        //         <button
        //           className="bg-golden text-black hover:bg-zinc-800 justify-center font-bold py-2 px-4 rounded-3xl"
        //           onClick={activeBoost.cost>0?goAheadPaidHandler:goAheadFreeBoostHandler}
        //         >
        //           Go ahead
        //         </button>
        //       ) : (
        //         <button
        //           className="bg-golden text-black  justify-center font-bold py-2 px-4 rounded-3xl"
        //           disabled={true}
        //         >
        //           Insufficient Balance
        //         </button>
        //       )}
        //     </div>
        //   </div>
        // </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75">
          <div
            className={`border-golden m-5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border transform transition-transform duration-500 ease-in-out ${
              isAnimating ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={() => {
                setActiveBoost(null);
                setGoHead(false);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-golden mb-4 text-center">
              {activeBoost?.name}
            </h2>
            <p className="text-white mb-4 chakra-petch-medium">
              {activeBoost?.description}
            </p>
            <div className="flex items-center justify-center mb-4">
              <img src={coin} alt="Coin" className="h-8 mr-2" />
              <p className="text-white text-xl">
                {activeBoost?.cost ? activeBoost.cost : "Free"}
              </p>
            </div>

            <div className="flex justify-center">
              {coinValue > activeBoost.cost ? (
                <button
                  className="bg-golden text-black hover:bg-zinc-800 justify-center font-bold py-2 px-4 rounded-3xl"
                  onClick={
                    activeBoost.cost > 0
                      ? goAheadPaidHandler
                      : goAheadFreeBoostHandler
                  }
                >
                  Go ahead
                </button>
              ) : (
                <button
                  className="bg-golden text-black justify-center font-bold py-2 px-4 rounded-3xl"
                  disabled={true}
                >
                  Insufficient Balance
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showNoBalancePopup && (
        <NoBalancePopup
          coinValue={coinValue}
          requiredAmount={requiredAmount}
          onClose={handleCloseNoBalancePopup}
        />
      )}
      {selectedBoost && (
        <BoostPurchasePopup boost={selectedBoost} onClose={handleClosePopup} />
      )}
    </div>
  );
};
export default Boost;
