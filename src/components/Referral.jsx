import React, { useState, useEffect, useContext } from "react";
import { FaRobot } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import { UserDataContext } from "../Utils/userDataContext";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader";
import share from "../../src/assets/share.png";
import group from "../../src/assets/group.png";
import dollar from "../../src/assets/dollar.png";

const Referral = () => {
  const [isLoading, setIsLoading] = useState(true);
  const level3Props = useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 200,
  });
  const [addFriendModal, setAddFriendModal] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const {
    getReferralCount,
    userData,
    addRef,
    getRefs,
    ReferralClaimDBHandler,
  } = useContext(UserDataContext);

  const [addFriendActiveModal, setAddFriendActiveModal] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  useEffect(() => {
    // Generate a random referral link
    const chatId = localStorage.getItem("chatId");
    const randomReferralLink = `https://t.me/HodlSwap_bot?start=${chatId}`;
    setReferralLink(randomReferralLink);
  }, []);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true); // Set copied to true when referral link is copied
  };

  const handleAddReferral = () => {
    // Simulate adding a new referral to the list
    const newReferral = `Referral ${getReferralCount() + 1}`;
    addRef(newReferral);
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleInviteClick = () => {
    const chatId = localStorage.getItem("chatId");
    const telegramLink = `https://t.me/HodlSwap_bot?start=${chatId}`;
    window.open(telegramLink, "_blank");
  };

  const AddFriendClaimHandler = (count, amount) => {
    const newDAta = userData.invitefriendsclaim;
    const arrayData = [];
    for (let i = 0; i < userData.referralCount; i++) {
      arrayData.push(false);
    }

    ReferralClaimDBHandler({
      referralCount: count,
      maxCoin: userData.maxCoin + amount,
      coin: userData.coin + amount,
      invitefriendsclaim: newDAta,
    });
  };

  const AddFriendHandler = ()=>{
    
  }

  function getNthTerm(n) {
    const startNumber = 250;
    const commonRatio = 2;
    if (n < 1) {
      throw new Error("The term number must be a positive integer.");
    }
    return startNumber * Math.pow(commonRatio, n - 1);
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg chakra-petch-bold">
      <div className="items-center mb-2 mt-6">
        <p className="text-3xl chakra-petch-bold text-black text-center mb-10">
          Referrals Count: {userData?.referralCount}
        </p>
      </div>

      {/* add friends  */}
      <div className="space-y-2 mx-4 mb-4">
        <h1 className="text-center text-2xl font-bold">Invite Friends</h1>

        <div className="border border-orange-400 shadow-md px-2 py-1 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center space-x-6">
              <div>
                <img src={group} alt="" className="h-5" />
              </div>
              <div className="">
                <div className="font-bold">
                  Add {userData.referralCount + 1} friends
                </div>
                <div className="flex space-x-1 ">
                  <div className="flex items-center justify-center">
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <div className="text-sm font-bold">
                    {getNthTerm(userData.referralCount + 1)} coins
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex items-center"
              onClick={() => {
                setAddFriendModal(!addFriendModal);
              }}
            >
              {addFriendModal && addFriendActiveModal === 1 ? (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(0);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(1);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="border border-orange-400 shadow-md p-2 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center space-x-6">
              <div>
                <img src={group} alt="" className="h-5" />
              </div>
              <div className="">
                <div className="font-bold">
                  Add {userData.referralCount + 2} friends
                </div>
                <div className="flex space-x-1 ">
                  <div className="flex items-center justify-center">
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <div className="text-sm font-bold">
                    {getNthTerm(userData.referralCount + 2)} coins
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {addFriendModal && addFriendActiveModal === 2 ? (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(0);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(2);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="border border-orange-400 shadow-md p-2 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center space-x-6">
              <div>
                <img src={group} alt="" className="h-5" />
              </div>
              <div className="">
                <div className="font-bold">
                  Add {userData.referralCount + 3} friends
                </div>
                <div className="flex space-x-1 ">
                  <div className="flex items-center justify-center">
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <div className="text-sm font-bold">
                    <div className="text-sm font-bold">
                      {getNthTerm(userData.referralCount + 3)} coins
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {addFriendModal && addFriendActiveModal === 3 ? (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(0);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    setAddFriendActiveModal(3);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              )}
            </div>
          </div>
          {/* <div className="w-full border-orange-500 border-2  rounded-lg ">
              <div className="h-4 bg-orange-500 rounded-lg">
                <div
                  className="h-full bg-progress-bar rounded-lg  flex items-center"
                  style={{ width: `${(userData.referralCount / 2) * 100}%` }}
                >
                  {userData.referralCount}/2
                </div>
              </div>
            </div> */}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <animated.div
          style={level3Props}
          className="text-black border-2  shadow-md mx-4 rounded-lg border-orange-400"
        >
          <div className="p-4  rounded-lg border  backdrop-blur-sm ">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold chakra-petch-bold ">
                My Invite Link
              </h3>
              <div className="rounded-full bg-orange-400">
                <div
                  className="p-2"
                  onClick={() => {
                    window.open(
                      `https://t.me/HodlSwap_bot?start=${localStorage.getItem(
                        "chatId"
                      )}`,
                      "__blank"
                    );
                  }}
                >
                  <img src={share} alt="" className="h-3" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 space-x-2">
              <div className="flex w-full ">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full  p-2 rounded-lg bg-white"
                />
              </div>
              <div>
                <button
                  className="px-4 py-2  rounded-lg bg-orange-400 text-white"
                  onClick={handleCopyReferralLink}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </animated.div>
        <div className="mt-4 mx-4">
          <h3 className="text-2xl font-bold chakra-petch-bold text-black">
            My Referrals:
          </h3>
          <ul className="mt-4">
            {userData.refs &&
              (userData.refs || []).map((referral, index) => (
                <li
                  key={index}
                  className="flex items-center text-lg chakra-petch-regular text-black"
                >
                  <FaRobot className="mr-2" /> User_{referral}
                </li>
              ))}
          </ul>
          <div className="flex justify-center items-center mt-20">
            {userData.refs && userData.refs.length <= 0 && (
              <p className=" text-black">You don't have any referrals</p>
            )}
          </div>
        </div>
      </div>

      {addFriendModal && (
        <div className="fixed z-40 inset-0 flex items-end justify-center bg-custom-gradient-tapgame transition-opacity duration-300">
        
          <div
            className={`relative bg-custom-gradient-tapgame rounded-t-lg w-screen shadow-lg h-screen transition-transform duration-300`}
          >
            <div className="flex flex-col items-center justify-center mx-16 space-y-3 h-[80%]">
            <button onClick={()=>{setAddFriendModal(false)}}>Xgffhfghfghf</button>
              <div>
                {/* <img src={socialModalData.image} className="h-40" alt="" /> */}
              </div>
              <div className="text-center text-2xl font-bold">
                {/* {socialModalData?.heading} */}
              </div>
              {/* <div className="text-center">{socialModalData?.description}</div> */}
              <div className="flex space-x-2 font-bold items-center">
                <img src={dollar} className="h-8" alt="" />
                <h1 className="text-xl">+100,000</h1>
              </div>

              <div>
                <button className="text-white font-bold text-xl bg-orange-400 px-4 py-1 border-white border-2 shadow-md rounded-sm">
                  {/* {socialModalData?.button1} */}
                </button>
              </div>

              <div>
                <button className="text-white font-bold text-xl bg-orange-400 px-28 py-2 border-white border-2 shadow-md rounded-sm">
                  {/* {socialModalData?.button2} */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
};

export default Referral;
