import React, { useState, useEffect, useContext } from "react";
import ShareBalance from "./ShareBalance";
import coin from "../Games/Assets/coin.png";
import boost1Image from "../assets/boosts/star-dynamic-premium.png";
import boost2Image from "../assets/boosts/sun-dynamic-premium.png";
// import { purchaseBoost, initializeData } from "./boostUtil";
import { CoinContext } from "../Utils/coinContext";
import BoostPurchasePopup from "./BoostPurchasePopup";
import NoBalancePopup from "./NoBalancePoup";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader"; // Import the Loader component
import {
  getDailyBoost,
  updateBoostLimit,
  getPaidBoost,
} from "../Utils/boostCreater";
import { useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState("TapCoin");
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [showNoBalancePopup, setShowNoBalancePopup] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [goHead, setGoHead] = useState(false);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClaim = async (boost) => {
    if (boost.limit > 0) {
      setActiveBoost(boost);
      if(boost.name=="10x"){
        setTapPerCoin(10);
      }
      else{
        setTapPerCoin(20)
      }
    }
    navigate("/games/tapcoin")
    setGoHead(true);
  };

  const handleCloseNoBalancePopup = () => {
    setShowNoBalancePopup(false);
  };

  const handleClosePopup = () => {
    setSelectedBoost(null);
  };

  const goAheadHandler = () => {
    updateBoostLimit(activeBoost.id, activeBoost.limit - 1);
    if (activeBoost.name == "10x") {
      setTapPerCoin(10);
    } else {
      setTapPerCoin(20);
    }
    navigate("/games/tapcoin");

    const updatedBoost = [];
    console.log(dailyBoost);
    for (let i = 0; i < dailyBoost.length; i++) {
      if (dailyBoost[i].id == activeBoost.id) {
        updatedBoost.push({
          ...dailyBoost[i],
          limit: activeBoost.limit - 1,
        });
      } else {
        updatedBoost.push(dailyBoost[i]);
      }
    }

    setDailyBoost(updatedBoost);
  };

  const handleBuy = (boost) => {
    console.log(boost);
    setActiveBoost(boost);
    setGoHead(true);
  };

  const goAheadPaidHandler = () => {
    updateCoinValue(coinValue - activeBoost.cost);

    if (activeBoost.name == "Full Energy") {
      updateScore();
    } else if (activeBoost.name == "AutoTap") {
      setAutoTapAmount(1);
    } else if (activeBoost.name == "10x AutoTap") {
      setAutoTapAmount(10);
    } else if (activeBoost.name == "50x AutoTap") {
      setAutoTapAmount(50);
    }

    setAutoTap(true);
    navigate("/games/tapcoin");
  };

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }

  return (
    <div className="h-screen p-10 bg-custom-gradient-tapgame">
      <ShareBalance view={1} balance={coinValue} />

      <div className="text-white h-[0.09px] my-4 opacity-10 bg-white"></div>
      <h1 className="chakra-petch-bold text-xl text-black">
        {" "}
        Free Daily Booster
      </h1>
      <div className="">
        {dailyBoost.map((boost) => (
          <div
            key={boost.id}
            className="flex flex-row md:flex-row items-center mb-2 rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-2 text-black"
          >
            <div className="flex justify-between flex-grow">
              <div className="flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-black">
                    {boost.name}
                    {"(" + boost.limit + ")"}
                  </h3>
                </div>
                {/* <p className="text-sm font-bold mb-2">{boost.description}</p> */}
              </div>
              <div className="flex items-center justify-end">
                <button
                  disabled={boost.limit <= 0 ? true : false}
                  className=" bg-golden text-black  hover:bg-zinc-800  font-bold py-1 px-4 rounded-3xl"
                  onClick={() => handleClaim(boost)}
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Boosters  */}
      <h1 className="chakra-petch-bold text-xl text-black"> Booster</h1>
      <div className="">
        {paidBoost.map((boost) => (
          <div
            key={boost.id}
            className="flex  justify-between md:flex-row items-center mb-2 rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-4 text-black"
          >
            <div className="flex  flex-grow justify-between">
              <div className="flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-black">{boost.name}</h3>
                </div>
                {/* <p className="text-sm font-bold mb-2">{boost.description}</p> */}
              </div>
              <div className="flex items-center justify-end">
                {
                  <button
                    disabled={boost.limit <= 0 ? true : false}
                    className=" bg-golden text-black  hover:bg-zinc-800  font-bold py-1 px-4 rounded-3xl"
                    onClick={() => handleBuy(boost)}
                  >
                    Buy
                  </button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      {goHead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75">
          <div className="border-golden m-5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border">
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={() => {
                setGoHead(false);
                setActiveBoost(null);
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
                  onClick={activeBoost.cost>0?goAheadPaidHandler:handleClaim}
                >
                  Go ahead
                </button>
              ) : (
                <button
                  className="bg-golden text-black  justify-center font-bold py-2 px-4 rounded-3xl"
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
