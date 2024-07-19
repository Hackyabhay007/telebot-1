import { Wallet } from "ethers";
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  navigate,
} from "react-router-dom";
import WalletGenerator from "./wallet";

const Admin = () => {
  const navigate = useNavigate();

  const handle = () => {
    navigate("/home/2231");
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-2 w-full bg-slate-200">
        <p className="text-white">Wallet Id:</p>
        <button
          className="ml-2 w-auto text-white rounded-full"
          onClick={"handleCopyWalletAddress"}
        >
          {/* {copied ? 'Copied' : <FaCopy />} */}
        </button>
      </div>
      <button onClick={handle}>Go to Home</button>
      {/* <WalletGenerator/> */}
    </div>
  );
};

export default Admin;
