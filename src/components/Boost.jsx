import React, { useState, useEffect, useContext } from "react";
import ShareBalance from "./ShareBalance";
import coin from "../Games/Assets/coin.png";
import boost1Image from "../assets/boosts/star-dynamic-premium.png";
import boost2Image from "../assets/boosts/sun-dynamic-premium.png";
import { purchaseBoost, initializeData } from "./boostUtil";
import { CoinContext } from "../Utils/coinContext";
import BoostPurchasePopup from "./BoostPurchasePopup";
import NoBalancePopup from "./NoBalancePoup";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader"; // Import the Loader component
import { getDailyBoost } from "../Utils/boostCreater";
import { useNavigate } from "react-router-dom";

const Boost = () => {
  const { coinValue, updateCoinValue, setActiveBoost, activeBoost , setTapPerCoin , tapPerCoin} =
    useContext(CoinContext);
  const [activeTab, setActiveTab] = useState("TapCoin");
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [showNoBalancePopup, setShowNoBalancePopup] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyBoost, setDailyBoost] = useState([]);
  const [goHead, setGoHead] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);


  const navigate=useNavigate()

  // useEffect(async () => {
  //   const timer = setTimeout(() => {
  //     initializeData(coinValue);
  //     setIsLoading(false);
  //   }, 500);

  //   const data = await getDailyBoost();
  //   setDailyBoost(data);

  //   return () => clearTimeout(timer);
  // }, []);

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
        initializeData(coinValue);
        setIsLoading(false);
      }, 500);
        
     
      try {
        const data = await getDailyBoost();
        setDailyBoost(data);
      } catch (error) {
        console.error('Error fetching daily boost:', error);
      }

      return () => clearTimeout(timer);
    };

    fetchData();
  }, []);
  
 
   
    

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePurchase = (boost) => {
    if (coinValue >= boost.price) {
      if (purchaseBoost(activeTab, boost)) {
        updateCoinValue(coinValue - boost.price);
        setSelectedBoost(boost); // Show the popup
      }
    } else {
      setRequiredAmount(boost.price);
      setShowNoBalancePopup(true);
    }
  };

  const handleClaim = (boost) => {
    if (boost.limit > 0) {
      setActiveBoost(boost);
    }
    setGoHead(true);
  };

  const handleCloseNoBalancePopup = () => {
    setShowNoBalancePopup(false);
  };

  const handleClosePopup = () => {
    setSelectedBoost(null);
  };

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }

  console.log(dailyBoost);

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
            className="flex flex-row md:flex-row items-center mb-2 rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-4 text-black"
          >
            <div className="flex  flex-grow">
              <div className="flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-black">
                    {boost.name}
                    {"(" + boost.limit + ")"}
                  </h3>
                </div>
                <p className="text-sm font-bold mb-2">{boost.description}</p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  disabled={boost.limit <= 0 ? true : false}
                  className=" bg-golden text-black  hover:bg-zinc-800  font-bold py-1 px-4 rounded-3xl"
                  onClick={() => handleClaim(boost)}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <h1 className='chakra-petch-bold text-xl text-black'> Boosters</h1>
      <div className="">
        {dailyBoost.map((boost) => (
          <div
            key={boost.id}
            className="flex flex-row md:flex-row items-center mb-2 rounded-md shadow-md bg-[#FFFFE5] cursor-pointer p-4 text-black"
          >
            <div className="mr-4 mb-2 md:mb-0 flex flex-col items-center border-r border-golden ">
              <div className="flex items-center mt-2">
                <span className=" text-md chakra-petch-regular mr-1">{boost.price}</span>
                <img src={coin} className="w-6" alt="coin" />
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-black">{boost.name}{"("+boost.quantity+")"}</h3>
              </div>
              <p className="text-sm font-bold mb-2">{boost.description}</p>
              <div className="flex items-center justify-end">
                <button 
                  className=" bg-golden text-black  hover:bg-zinc-800  font-bold py-1 px-4 rounded-3xl"
                  onClick={() => handlePurchase(boost)}
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}
      {goHead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75">
          <div className="border-golden m-5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border">
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={()=>{
                setGoHead(false);
                setActiveBoost(null)
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
              <p className="text-white text-xl">Free</p>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-golden text-black hover:bg-zinc-800 justify-center font-bold py-2 px-4 rounded-3xl"
                onClick={()=>{
                  console.log(activeBoost.name)
                  if(activeBoost.increment==10){setTapPerCoin(10)}
                  else{setTapPerCoin(20)}
                   navigate('/games/tapcoin')
                }}
              >
                Go ahead
              </button>
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
