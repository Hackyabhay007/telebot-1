import React, { useEffect, useState, useContext } from "react";
import coin from "../assets/coin.webp";
import { CoinContext } from "../Utils/coinContext"; // Adjust the import path as necessary

const ShareBalance = ({ view }) => {
  const { coinValue } = useContext(CoinContext);

  return (
    <div className="bg-[#FFFFE5] flex items-center justify-center  border border-golden py-2 shadow-md rounded-md ">
      <React.Fragment>
        <div className="text-center ">
          <h3 className="text-xl chakra-petch-medium text-black font-extrabold">
            Your Balance
          </h3>
          <div className=" flex justify-center items-center space-x-2 px-12">
            <img src={coin} className="h-12" alt="" />

            <p className="text-3xl chakra-petch-bold  text-golden">
              {coinValue !== null ? coinValue : "Loading..."}
            </p>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default ShareBalance;
