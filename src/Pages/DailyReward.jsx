import React, { useContext } from "react";
import Profile from "../components/Profile";
import dollar from "../../src/assets/dollar.png";
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
];

const DailyReward = () => {
  const { userData, updateUserData } = useContext(UserDataContext);

  const ClaimHandler = (reward) => {
    const dailyreward = userData.DailyReward;
    const newCoinValue = userData.coin + reward.amount;
    const newMaxCoinValue = userData.maxCoin + reward.amount;
    dailyreward[reward.id-1] = true;

    updateUserData({
      DailyReward: dailyreward,
      coin: newCoinValue,
      maxCoin: newMaxCoinValue,
    });
  };

  console.log(userData);
  return (
    <div className="text-black ">
      <div className=" m-4">
        <Profile />
      </div>
      <div className="flex flex-col items-center my-10">
        <img src={dollar} alt="" className="h-16" />
        <h1 className="text-3xl font-bold">Daily Reward</h1>
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
