import React, { useContext , useEffect , useState } from "react";
import Profile from "../components/Profile";
import dollar from "../../src/assets/dollar.png";
import Loader from "../components/Loader";
import { UserDataContext } from "../Utils/userDataContext";

const dailyRewardData = [
  {
    id: 1,
    day: "01",
    amount: 500,
    label: "500",
  },
  {
    id: 2,
    day: "02",
    amount: 1000,
    label: "1k",
  },
  {
    id: 3,
    day: "03",
    amount: 2500,
    label: "2.5k",
  },
  {
    id: 4,
    day: "04",
    amount: 5000,
    label: "5k",
  },
  {
    id: 5,
    day: "05",
    amount: 15000,
    label: "15k",
  },
  {
    id: 6,
    day: "06",
    amount: 25000,
    label: "25k",
  },
  {
    id: 7,
    day: "07",
    amount: 50000,
    label: "50k",
  },
  {
    id: 8,
    day: "08",
    amount: 100000,
    label: "100k",
  },
  {
    id: 9,
    day: "09",
    amount: 500000,
    label: "500k",
  },
  {
    id: 10,
    day: "10",
    amount: 1000000,
    label: "1M",
  },
  {
    id: 11,
    day: "11",
    amount: 1500000,
    label: "1.5M",
  },
  {
    id: 12,
    day: "12",
    amount: 2000000,
    label: "2M",
  },
  {
    id: 13,
    day: "13",
    amount: 2500000,
    label: "2.5M",
  },
  {
    id: 14,
    day: "14",
    amount:3000000,
    label: "3M",
  },
  {
    id: 15,
    day: "15",
    amount:3500000,
    label: "3.5M",
  },
  {
    id: 16,
    day: "16",
    amount: 4000000,
    label: "4M",
  },
  {
    id: 17,
    day: "17",
    amount: 4500000,
    label: "4.5M",
  },
  {
    id: 18,
    day: "18",
    amount: 5000000,
    label: "5M",
  },
  {
    id: 19,
    day: "19",
    amount: 5500000,
    label: "5.5M",
  },
  {
    id: 20,
    day: "20",
    amount: 6000000,
    label: "6M",
  },
  {
    id: 21,
    day: "21",
    amount: 7000000,
    label: "7M",
  },
  {
    id: 22,
    day: "22",
    amount: 8000000,
    label: "8M",
  },
  {
    id: 23,
    day: "23",
    amount: 9000000,
    label: "9M",
  },
  {
    id: 24,
    day: "24",
    amount:10000000,
    label: "10M",
  },
  {
    id: 25,
    day: "25",
    amount:11000000,
    label: "11M",
  },
  {
    id: 26,
    day: "26",
    amount: 12000000,
    label: "12M",
  },
  {
    id: 27,
    day: "27",
    amount: 13000000,
    label: "13M",
  },
  {
    id: 28,
    day: "28",
    amount: 14000000,
    label: "14M",
  },
  {
    id: 29,
    day: "29",
    amount: 15000000,
    label: "15M",
  },
  {
    id: 30,
    day: "30",
    amount: 20000000,
    label: "20M",
  },

];

const DailyReward = () => {
  const { userData, updateUserData } = useContext(UserDataContext);

  const [isLoading, setIsLoading] = useState(true);


  const ClaimHandler = (reward) => {
    const dailyreward = userData.DailyReward;
    const newCoinValue = userData.coin + reward.amount;
    const newMaxCoinValue = userData.maxCoin + reward.amount;
    dailyreward[reward.id - 1] = true;

    updateUserData({
      DailyReward: dailyreward,
      coin: newCoinValue,
      maxCoin: newMaxCoinValue,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
 
  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }
  
  console.log(userData)
  return (
    <div className="text-black ">
      <div className="flex flex-col items-center my-10">
        <img src={dollar} alt="" className="h-16" />
        <h1 className="text-3xl font-bold">Daily Coins</h1>
      </div>
      <div className="flex  flex-col items-center">
        <div className="grid grid-cols-4 justify-center gap-3 ">
          {dailyRewardData.map((reward, index) => (
            <div key={reward.id} className="">
              <div className="bg-[#FA891B] text-center text-white w-20">
                Day{" " + reward.day}
              </div>
              <div className="w-full flex flex-col items-center border-2 border-[#FA891B] bg-[#FDE5C1] border-collapse">
                <img src={dollar} alt="" className="" />
                <h1 className="font-bold">{reward.label}</h1>
              </div>
              <button
                className="w-full border-2 bg-[#FA7A16] border-white text-white my-0.5"
                disabled={
                  userData.created_at + index <= new Date().getDate()
                    ? false
                    : true
                }
                onClick={() => {
                  if (userData.DailyReward[index] === false) {
                    ClaimHandler(reward);
                  }
                }}
              >
                {userData.DailyReward[index] === true ? "Claimed" : "Claim"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
