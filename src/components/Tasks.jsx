import React, { useState, useContext, useEffect, Children } from "react";
import level1 from "../assets/levels/level1.png";
import level2 from "../assets/levels/level2.png";
import level3 from "../assets/levels/level3.png";
import level4 from "../assets/levels/level4.png";
import level5 from "../assets/levels/level5.png";
import level6 from "../assets/levels/level6.png";
import SpecialTaskPopup from "./SpecialTaskPopup";
import boy from "../assets/boy.png";
import { UserDataContext } from "../Utils/userDataContext";
import { firestore } from "../Utils/remote";
import { CoinContext } from "../Utils/coinContext";
import Loader from "./Loader"; // Import the Loader component
import BottomNavBar from "./BottomNavBar";
import youtube from "../../src/assets/youtube.png";
import telegram from "../../src/assets/telegram.png";
import instagram from "../../src/assets/instagram.png";
import twitter from "../../src/assets/twitter.png";
import dollar from "../../src/assets/dollar.png";
import group from "../../src/assets/group.png";

function Tasks() {
  const [loading, setLoading] = useState(true); // Add loading state
  const [activeTab, setActiveTab] = useState("special");
  const [showSpecialTaskPopup, setShowSpecialTaskPopup] = useState(false);
  const [selectedSpecialTask, setSelectedSpecialTask] = useState(null);
  const [tasks, setTasks] = useState({ special: [], leagues: [], ref: [] });

  // state for add friends
  const [addFriendModal, setAddFriendModal] = useState(false);
  const [addFriendBonus, setAddFriendBonus] = useState(0);

  const {
    userData,
    getMaxCoin,
    updateCoin,
    addClaimedTask,
    updateUserData,
    level,
    ReferralClaimDBHandler,
    SocialMediaClaimDBHandler,
  } = useContext(UserDataContext);
  const { updateCoinValue } = useContext(CoinContext);

  const addFriend = {
    bonus: 250,
    starting: 1,
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await firestore.collection("tasks").get();
        const tasksData = tasksSnapshot.docs.reduce((acc, doc) => {
          const task = doc.data();
          const category = task.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({ ...task, id: doc.id });
          return acc;
        }, {});

        const userSnapshot = await firestore
          .collection("users")
          .doc(localStorage.getItem("chatId"))
          .get();
        const userClaimedTasks = userSnapshot.data().claimedTasks || [];

        // Mark tasks as claimed if they are in user's claimedTasks
        if (userClaimedTasks) {
          Object.keys(tasksData).forEach((category) => {
            tasksData[category] = tasksData[category].map((task) => ({
              ...task,
              claimed: userClaimedTasks.includes(task.id),
            }));
          });
        }

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchTasks();
  }, [userData.uid]);

  const handleClaim = async (task) => {
    try {
      await addClaimedTask(task.id);
      await updateCoinValue(Number(userData.coin) + Number(task.reward));
      // Update the UI after claiming the task
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].map((t) =>
            t.id === task.id ? { ...t, claimed: true } : t
          );
        });
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error claiming task:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSpecialTaskClick = (task) => {
    setSelectedSpecialTask(task);
    setShowSpecialTaskPopup(true);
  };

  const handleCloseSpecialTaskPopup = () => {
    setShowSpecialTaskPopup(false);
    setSelectedSpecialTask(null);
  };

  const isTaskClaimable = (task) => {
    if (task.category === "ref") {
      return userData.referralCount >= task.requiredInvites;
    } else if (task.category === "leagues") {
      return getMaxCoin() >= task.required;
    }
    return false;
  };

  if (loading) {
    return <Loader />;
  }


  const AddFriendClaimHandler = (count, amount) => {
    const newDAta = userData.invitefriendsclaim;
    const arrayData=[]
    for (let  i=0 ; i<userData.referralCount ; i++){
      arrayData.push(false);
    }

    ReferralClaimDBHandler({
      referralCount: count,
      maxCoin: userData.maxCoin + amount,
      coin: userData.coin + amount,
      invitefriendsclaim: newDAta,
    });
  };

  function getNthTerm(n) {
    const startNumber = 250;
    const commonRatio = 2;
    if (n < 1) {
      throw new Error("The term number must be a positive integer.");
    }
    return startNumber * Math.pow(commonRatio, n - 1);
  }

  const SocialMediaClaimHandler = (id) => {
    if (id == "youtube") {
      const newData = {
        joinYoutube: true,
        maxCoin: userData.maxCoin + 5000,
        coin: userData.coin + 5000,
      };
      SocialMediaClaimDBHandler(newData);
    } else if (id === "telegram") {
      const newData = {
        joinTelegram: true,
        maxCoin: userData.maxCoin + 5000,
        coin: userData.coin + 5000,
      };
      SocialMediaClaimDBHandler(newData);
    } else if (id === "instagram") {
      const newData = {
        joinInstagram: true,
        maxCoin: userData.maxCoin + 5000,
        coin: userData.coin + 5000,
      };
      SocialMediaClaimDBHandler(newData);
    } else {
      const newData = {
        joinTwitter: true,
        maxCoin: userData.maxCoin + 5000,
        coin: userData.coin + 5000,
      };
      SocialMediaClaimDBHandler(newData);
    }
  };


  return (
    <div className="py-4 overflow-hidden space-y-2">
      <div className=" mx-4">
        {/* Socials  */}
        <div className=" space-y-2">
          <h1 className="text-center text-2xl font-bold">Join Our Socials</h1>
          <div className="flex justify-between items-center border border-orange-400 shadow-md px-2 py-1 rounded-lg">
            <div className="flex space-x-6 items-center">
              <div>
                <img src={youtube} alt="" />
              </div>
              <div>
                <div className="text-base font-bold">Join Youtube Channel</div>
                <div className="flex  items-center space-x-1">
                  <div>
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <p className="font-bold text-sm">5000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!addFriendModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinYoutube}
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    SocialMediaClaimHandler("youtube");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border border-orange-400 shadow-md px-2 py-1 rounded-lg">
            <div className="flex space-x-6 items-center">
              <div>
                <img src={telegram} alt="" />
              </div>
              <div>
                <div className="text-base font-bold">Join Telegram Channel</div>
                <div className="flex  items-center space-x-1">
                  <div>
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <p className="font-bold text-sm">5000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!addFriendModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinTelegram}
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    SocialMediaClaimHandler("telegram");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border border-orange-400 shadow-md px-2 py-1 rounded-lg">
            <div className="flex space-x-6 items-center">
              <div>
                <img src={instagram} alt="" />
              </div>
              <div>
                <div className="text-base font-bold">
                  Join Instagram Channel
                </div>
                <div className="flex  items-center space-x-1">
                  <div>
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <p className="font-bold text-sm">5000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!addFriendModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinInstagram}
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    SocialMediaClaimHandler("instagram");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border border-orange-400 shadow-md px-2 py-1 rounded-lg">
            <div className="flex space-x-6 items-center">
              <div>
                <img src={twitter} alt="" />
              </div>
              <div>
                <div className="text-base font-bold">Join X Channel</div>
                <div className="flex  items-center space-x-1">
                  <div>
                    <img src={dollar} className="h-5" alt="" />
                  </div>
                  <p className="font-bold text-sm">5000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!addFriendModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinTwitter}
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                    SocialMediaClaimHandler("twitter");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              ) : (
                <svg
                  className="h-6"
                  onClick={() => {
                    setAddFriendModal(!addFriendModal);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* add friends  */}
        <div className="space-y-2 mt-5">
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
              <div className="flex items-center">
                {!addFriendModal ? (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
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
                {!addFriendModal ? (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
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
                {!addFriendModal ? (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6"
                    onClick={() => {
                      setAddFriendModal(!addFriendModal);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
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

        {/* {activeTab === "leagues" &&
          tasks[activeTab].map((level) => (
            <div
              key={level.id}
              className={`flex flex-col items-start rounded-md backdrop-blur-sm mb-2 bg-golden/10 relative p-6 ${
                level.claimed ? "opacity-50" : ""
              }`}
            >
              <div className="flex">
                <div className="flex">
                  <div className="relative">
                    <img
                      src={getLevelImage(level.name)}
                      alt={level.name}
                      className="h-10"
                    />
                  </div>
                  <div className="flex-grow relative">
                    <h3 className="text-sm font-bold text-golden">
                      {level.name}
                    </h3>
                    <p className="text-sm text-white">{level.reward} coins</p>
                  </div>
                </div>
                <button
                  className="bg-zinc-800 text-white font-bold py-1 px-4 mt-3 mr-4 rounded-3xl absolute top-4 right-2"
                  style={{
                    opacity: isTaskClaimable(level) ? 1 : 0.4,
                  }}
                  onClick={() => {
                    handleClaim(level);
                  }}
                  disabled={!isTaskClaimable(level) || level.claimed}
                >
                  Claim
                </button>
              </div>

              <div className="w-full bg-transparent rounded-full relative  mt-2 overflow-hidden">
                <div className="h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-golden rounded-full"
                    style={{
                      width: `${Math.min(
                        (userData.coin / level.required) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="text-center text-black text-xs font-medium absolute py-2 -top-2 left-4 ">
                  <p>
                    {userData.coin}/{level.required}
                  </p>
                </div>
              </div>
            </div>
          ))} */}
        <div
          key={level.id}
          className={`flex flex-col items-start rounded-md backdrop-blur-sm mb-2 bg-golden/10 relative p-6 ${
            level.claimed ? "opacity-50" : ""
          }`}
        >
          <div className="flex">
            <div className="flex">
              <div className="relative">
                <img
                  src={getLevelImage(level.name)}
                  alt={level.name}
                  className="h-10"
                />
              </div>
              <div className="flex-grow relative">
                <h3 className="text-sm font-bold text-golden">{level.name}</h3>
                <p className="text-sm text-white">{level.reward} coins</p>
              </div>
            </div>
            <button
              className="bg-zinc-800 text-white font-bold py-1 px-4 mt-3 mr-4 rounded-3xl absolute top-4 right-2"
              style={{
                opacity: isTaskClaimable(level) ? 1 : 0.4,
              }}
              onClick={() => {
                handleClaim(level);
              }}
              disabled={!isTaskClaimable(level) || level.claimed}
            >
              Claim
            </button>
          </div>

          <div className="w-full bg-transparent rounded-full relative  mt-2 overflow-hidden">
            <div className="h-4 bg-gray-200 rounded-full">
              <div
                className="h-full bg-golden rounded-full"
                style={{
                  width: `${Math.min(
                    (userData.coin / level.required) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="text-center text-black text-xs font-medium absolute py-2 -top-2 left-4 ">
              <p>
                {userData.coin}/{level.required}
              </p>
            </div>
          </div>
        </div>
      </div>

      {addFriendModal && (
        <div className="fixed inset-0 z-50  flex items-end justify-center  transition-opacity duration-300">
          <div
            className={`relative bg-white rounded-t-3xl w-screen shadow-lg h-2/3 transition-transform duration-300 ${
              "ddf" ? "modal-enter" : "modal-exit"
            }`}
          >
            <button
              // onClick={onClose}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
            >
              {/* <XIcon className="h-6 w-6" /> */}
            </button>
            <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
            <p className="text-gray-700">This is the content of the modal.</p>
            <button
              // onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
      <BottomNavBar></BottomNavBar>
    </div>
  );
}

export default Tasks;

const getLevelImage = (levelName) => {
  switch (levelName) {
    case "Level1":
      return level1;
    case "Level2":
      return level2;
    case "Level3":
      return level3;
    case "Level4":
      return level4;
    case "Level5":
      return level5;
    case "Level6":
      return level6;
    default:
      return ""; // Default image or empty string if no image found
  }
};
