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
import levelCircle from "../../src/assets/level-circel.png";
import level1 from "../../src/assets/level-1.png";
import level2 from "../../src/assets/level-2.png";
import level3 from "../../src/assets/level-3.png";
import level4 from "../../src/assets/level-4.png";
import level5 from "../../src/assets/level-5.png";
import level6 from "../../src/assets/level-6.png";
import level7 from "../../src/assets/level-7.png";
import level8 from "../../src/assets/level-8.png";
import level9 from "../../src/assets/level-9.png";
import level10 from "../../src/assets/level-10.png";
import level11 from "../../src/assets/level-11.png";
import level12 from "../../src/assets/level-12.png";
import level13 from "../../src/assets/level-13.png";
import level14 from "../../src/assets/level-14.png";
import level15 from "../../src/assets/level-15.png";
import level16 from "../../src/assets/level-16.png";
import level17 from "../../src/assets/level-17.png";

import profile2 from "../../src/assets/profile-2.png";
import rank1 from "../../src/assets/rankOneBadge.png";
import rank2 from "../../src/assets/rankTwoBadge.png";
import rank3 from "../../src/assets/rankThreeBadge.png";

const Levels = () => {
  const { updateBoostLimit, userData , users, fetchUsers } =
    useContext(UserDataContext);

    const [level , setLevel]=useState(0)

  const ranks = [rank1, rank2, rank3, ""];

  const navigate = useNavigate();

  const levelNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
  ];

  const levelMinPoints = [
    0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 5000000,
    6500000,
  ];

  const imageData = [
    {
      id: 1,
      image: level1,
    },
    {
      id: 2,
      image: level2,
    },
    {
      id: 3,
      image: level3,
    },
    {
      id: 4,
      image: level4,
    },
    {
      id: 5,
      image: level5,
    },
    {
      id: 6,
      image: level6,
    },
    {
      id: 7,
      image: level7,
    },
    {
      id: 8,
      image: level8,
    },
    {
      id: 9,
      image: level9,
    },
    {
      id: 10,
      image: level10,
    },
    {
      id: 11,
      image: level11,
    },
    {
      id: 12,
      image: level12,
    },
    {
      id: 13,
      image: level13,
    },
    {
      id: 14,
      image: level14,
    },
    {
      id: 15,
      image: level15,
    },
    {
      id: 16,
      image: level16,
    },
    {
      id: 17,
      image: level17,
    },

  ];

  useEffect(() => {
    const chatId = localStorage.getItem("chatId");
    if (chatId) {
      fetchUsers(chatId);
    }
  }, []);

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // Format number as millions
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"; // Format number as thousands
    } else {
      return num.toString(); // Return number as is if it's less than 1000
    }
  }

  console.log("Re renderng")

  return (
    <WebAppProvider>
      <div className=" min-h-screen  overflow-hidden   flex flex-col justify-start mt-10  bg-custom-gradient-tapgame text-white font-display chakra-petch-bold  ">
        <div className="">
          <div className="mx-4 ">
            <Profile />
          </div>
          {/* levels */}
          <div className="flex my-4 justify-between  bg-[#FFFFE5] text-black   shadow-md mx-3 px-2 border-orange-400 border rounded-xl py-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-20">Level - {levelNames[level]}</div>
              {/* <div className="w-[60vw] ">
                <div className="h-4 bg-orange-500 rounded-lg ">
                  <div
                    className="h-full bg-[#FDCD45] rounded-lg"
                    style={{
                      width: `${
                        (userData.maxCoin / levelMinPoints[level]) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div> */}
              <div
                onClick={() => {
                  navigate("/levels");
                }}
              >
                <svg
                  className="h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center ">
            <div
              className={`relative coin-container flex  justify-center w-full  transform bg-level-gradient`}
            >
              <span className="absolute left-5 top-1/2"
               onClick={()=>{
                if(level>1){
                  setLevel(level-1)
                }
                else{
                  setLevel(16)
                }
               }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  className="bi bi-chevron-left text-black font-bold"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                  />
                </svg>
              </span>
              <span className="absolute right-5 top-1/2"
                onClick={()=>{
                  if(level<16){
                    setLevel(level+1)
                  }
                  else{
                    setLevel(0)
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  class="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </span>
              <img src={imageData[level].image} className="pb-5 h-52" />
              <img
                src={levelCircle}
                alt=""
                className="absolute bottom-0 pr-5"
              />
            </div>
          </div>

          {users.map((user, index) => (
            <div className="flex justify-between px-4 items-center gap-6  bg-[#FDE5C1]  rounded-lg shadow-md border border-orange-400 my-2 py-2 mx-4">
              <div className="flex space-x-2">
                <div className="p-2  rounded-full bg-[#FA891B]">
                  <img className=" p-1  h-8" src={profile2} alt="profile" />
                </div>
                <div className="text-black">
                  <div>
                    {localStorage.getItem("chatId") !== user.id
                      ? `${user.id}`
                      : ` ${user.id}(you)`}
                  </div>
                  <div>Rank</div>
                </div>
              </div>
              <div>
                <img src={ranks[index]} alt="" />
              </div>
              <div className="w-28 flex bg-[#FA891B] items-center justify-center px-3 py-1 rounded-lg space-x-2">
                <div className="">
                  <img src={dollar} alt="" className="h-7" />
                </div>
                <div>{formatNumber(user.maxCoin)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BackButton onClick={() => navigate("/games")} />;
    </WebAppProvider>
  );
};

export default Levels;
