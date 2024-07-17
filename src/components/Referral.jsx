import React, { useState, useEffect, useContext } from "react";
import { FaRobot } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import { UserDataContext } from "../Utils/userDataContext";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader"; // Import the Loader component

const Referral = () => {
  const [isLoading, setIsLoading] = useState(true);
  const level3Props = useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 200,
  });

  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false); // State to track if referral link is copied
  const { getReferralCount, userData, addRef, getRefs } =
    useContext(UserDataContext);

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
    return <Loader />; // Display the loader while the content is loading
  }

  const handleInviteClick = () => {
    const chatId = localStorage.getItem("chatId");
    const telegramLink = `https://t.me/HodlSwap_bot?start=${chatId}`;
    window.open(telegramLink, '_blank'); 
  };

  return (
    <div className="py-12 px-10 overflow-hidden rounded-lg chakra-petch-bold">
      <div className="items-center mb-4">
        <p className="text-3xl chakra-petch-bold text-black text-center mb-10">
          Referral Count: {userData.refs.length}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <animated.div style={level3Props} className="bg-[#FFFFE5] text-black">
          <div className="p-4  rounded-lg border border-golden backdrop-blur-sm ">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold chakra-petch-bold ">
                Referral Program
              </h3>
            </div>
            <p className="text-lg chakra-petch-regular">
              Invite friends to join and earn rewards!
            </p>
            <div className="flex items-center mt-4">
              <div className="flex w-full p-1 rounded-full backdrop-blur-sm bg-golden/10">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full  p-2 rounded-lg bg-transparent"
                />
                <button
                  className="p-2 bg-golden text-black rounded-full"
                  onClick={handleCopyReferralLink}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </animated.div>
        <div className="mt-4">
          <h3 className="text-xl font-bold chakra-petch-bold text-black">
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
            {userData.refs && userData.refs.length <= 0 && (
              <p className=" text-white">No Refferal's Found</p>
            )}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-[130px] left-1/2 transform -translate-x-1/2">
        <button 
        onClick={handleInviteClick}
        className="border-2 px-9 py-3 animate-scale-up-down bg-[#FFFFE5] text-black rounded-lg">
          Invite a Friend
        </button>
      </div>
    </div>
  );
};

export default Referral;
