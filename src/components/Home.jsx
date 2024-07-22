import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authenticateUserById, createUser } from "../Utils/remote.js";
import Loader from "./Loader"; // Import the Loader component
import { FaCopy } from "react-icons/fa"; // Import the copy icon
import { useSpring, animated } from "react-spring"; // Import animations
import { ethers } from "ethers";
import { UserDataContext } from "../Utils/userDataContext.jsx";
import BottomNavBar from "./BottomNavBar.jsx";

const AuthPage = () => {
  const navigate = useNavigate();
  const { chatId, refId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [CreatedUserData, setCreatedUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false); // State to track if wallet address is copied
  const [walletCopied, setWalletCopied] = useState(false);
  const [copiedGoto, setCopiedGoto] = useState(false);
  const { addRef } = useContext(UserDataContext);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const isAuthenticated = await authenticateUserById(chatId);

        if (isAuthenticated) {
          console.log(
            "User already exists, redirect to /games" +
              JSON.stringify(isAuthenticated)
          );
          //  navigate("/games");
        } else {
          console.log("User doesn't exist, create a new user");

          // Generate a new wallet
          const wallet = ethers.Wallet.createRandom();

          // Set the wallet ID, passphrase, and private key
          const walletAddress = wallet.address;
          const passphrase = wallet.mnemonic.phrase;
          const privateKey = wallet.privateKey;

          const userData = {
            chatId: chatId,
            walletAddress: walletAddress,
            claimedTasks: [],
            coin: 100000,
            maxCoin: 100000,
            referralCount: 0,
            invitefriendsclaim:[],
            refs: [],
            limit10x: 3,
            limit20x: 3,
            startDay10x: new Date().getDate(),
            nextDay10x: new Date().getDate() + 1,
            startDay20x: new Date().getDate(),
            nextDay20x: new Date().getDate() + 1,
            DailyReward: [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ],
            created_at:new Date().getDate(),
            joinYoutube:false,
            joinTelegram:false,
            joinTwitter:false,
            joinInstagram:false , 
          };

          const createdUser = await createUser(userData);
          setCreatedUserData({
            ...createdUser,
            passphrase,
            privateKey,
          });
          setShowPopup(true);
        }

        if (refId) {
          await addRef(refId);
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        setError("An error occurred during authentication");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      authenticate();
    } else {
      setError("Chat ID is missing");
      navigate("/notfound");
      setIsLoading(false);
    }
  }, [chatId, navigate]);

  const closePopup = () => {
    if (copied) {
      setShowPopup(false);
      navigate("/games");
    } else if (!copied) {
      setCopiedGoto(true);
    }
  };

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(CreatedUserData.walletAddress);
    setWalletCopied(true); // Set copied to true when wallet address is copied
  };

  const handleCopyPassphrase = () => {
    navigator.clipboard.writeText(CreatedUserData.passphrase);
    setCopied(true); // Set copied to true when passphrase is copied
  };

  if (isLoading) {
    return <Loader />; // Replace the loading message with the Loader component
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (copiedGoto) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mx-3 px-8 py-4 text-white text-center  shadow-lg flex  flex-col items-center mb-4 mt-2  rounded-lg  border-golden backdrop-blur-sm bg-golden/10">
          <div className="absolute end-1 top-1">
            <button
              type="button"
              class="  end-2.5 text-white bg-transparent    rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-black hover:bg-opacity-20"
              data-modal-hide="popup-modal"
              onClick={() => {
                setCopiedGoto(false);
              }}
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm mt-4">
            Make sure you take screenshot or copy your wallet id and passphrase
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button
              className="bg-golden text-black py-2 px-4 rounded-full"
              onClick={() => {
                navigate("/games");
              }}
            >
              Go to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute h-[89%]  w-full flex justify-center items-center md:mb-4 over overflow-y-auto">
      {showPopup && (
        <div className="flex items-center justify-center md:mx-2 ">
          <div className="popup-content backdrop-blur  px-2 md:p-6 text-center">
            <h2 className="text-md  text-golden font-bold text-sm md:text-lg">
              Welcome, new User! , 100,000 Coins Added in your Wallet
            </h2>
            <hr className="border-t-2 border-golden w-full opacity-50" />
            <p className="chakra-petch-regular text-sm md:text-lg text-white md:py-2 py-1 mb-4 ">
              We have created a wallet for you and we will transfer all your
              points to your wallet.
            </p>
            <div className="flex justify-center w-full flex-col text-white">
              <div className="flex  items-center justify-center py-1">
                <p className="text-md md:mr-2 t text-golden font-semibold md:font-bold">
                  Wallet Id:
                </p>
                <div className="text-sm  md:text-base flex w-9/12 md:w-4/5  md:p-1 rounded-full backdrop-blur-sm bg-golden/10">
                  <input
                    type="text"
                    value={CreatedUserData.walletAddress}
                    readOnly
                    className=" w-full text-white p-1  truncate md:p-2 rounded-lg bg-transparent"
                  />
                  <button
                    className="p-1 md:p-2 bg-golden text-black rounded-full "
                    onClick={handleCopyWalletAddress}
                  >
                    {walletCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* passphrase */}
              <div className="flex   flex-col items-center mb-2 mt-6 relative rounded-lg border border-golden backdrop-blur-sm bg-golden/5 bg-opacity-25 px-1.5 md:px-4 pt-2 md:py-2">
                <div className="flex w-full justify-center items-center space-x-4 mb-2">
                  <p className="text-md md:text-xl  md:font-bold md:chakra-petch-semibold text-white">
                    Pass Phrase
                  </p>
                  <button
                    className="text-sm  md:text-md  w-20 flex p-1 md:p-2 bg-golden text-black rounded-full justify-center"
                    onClick={handleCopyPassphrase}
                  >
                    {copied ? (
                      "Copied"
                    ) : (
                      <span className="flex justify-center items-center space-x-1">
                        Copy
                        <FaCopy className="ml-1" />
                      </span>
                    )}
                  </button>
                </div>
                <div className="text-sm mb-2 md:text-lg  p-2 md:px-4 md:py-2 pb-1 text-white grid grid-cols-3 gap-2 md:gap-4 w-full h-68 overflow-y-auto items-center md:mb-2 rounded-md backdrop-blur-sm  bg-golden/5">
                  {CreatedUserData.passphrase.split(" ").map((word, index) => (
                    <div
                      className="rounded-lg  border py-1  truncate border-golden flex px-1 md:px-3 space-x-2 md:space-x-4"
                      key={index}
                    >
                      <div>{index + 1}.</div>
                      <div className="">{word}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                class="text-left   md:text-lg   mb-4 text-sm text-yellow-800 rounded-lg dark:text-yellow-300"
                role="alert"
              >
                <span className="font-bold ">Warning:</span>Make sure you take
                screenshot or copy your wallet id and passphrase
              </div>
            </div>

            <div className="py-4">
              <button
                className="bg-golden text-black py-2 px-4 rounded-full "
                onClick={closePopup}
              >
                Go to Games
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNavBar/>
    </div>
  );
};

export default AuthPage;
