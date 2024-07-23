import React, { useState, useContext, useEffect, Children } from "react";
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
import socialYoutube from "../../src/assets/socialYoutube.png";
import { button } from "@material-tailwind/react";

function Tasks() {
  const [loading, setLoading] = useState(true); // Add loading state
  const [activeTab, setActiveTab] = useState("special");
  const [showSpecialTaskPopup, setShowSpecialTaskPopup] = useState(false);
  const [selectedSpecialTask, setSelectedSpecialTask] = useState(null);
  const [tasks, setTasks] = useState({ special: [], leagues: [], ref: [] });
  const [levels, setLevels] = useState([]);

  // state for socails friends
  const [socialModal, setSoialModal] = useState(false);
  const [socialModalData, setSoialModalData] = useState({});


  // state for levels 
  const [levelModal , setLevelModal]=useState(false)

  const socialData = [
    {
      id: "youtube",
      heading: "Who is Satoshi Nakamoto? The Creator of Bitcoin?",
      description:
        "These are 6 cruptography experts people thought could be Satoshi Nakamoto",
      image: socialYoutube,
      button1: "Watch Video & Earn",
      button2: "Check",
    },
    {
      id: "telegram",
      heading: "Who is Satoshi Nakamoto? The Creator of Bitcoin?",
      description:
        "These are 6 cruptography expertspeople thought could be Satoshi Nakamoto",
      image: telegram,
      button1: "Watch Video & Earn",
      button2: "Check",
    },
    {
      id: "instagram",
      heading: "Who is Satoshi Nakamoto? The Creator of Bitcoin?",
      description:
        "These are 6 cruptography experts people thought could be Satoshi Nakamoto",
      image: instagram,
      button1: "Watch Video & Earn",
      button2: "Check",
    },
    {
      id: "twitter",
      heading: "Who is Satoshi Nakamoto? The Creator of Bitcoin?",
      description:
        "These are 6 cruptography experts people thought could be Satoshi Nakamoto",
      image: twitter,
      button1: "Watch Video & Earn",
      button2: "Check",
    },
  ];

  const {
    userData,
    getMaxCoin,
    updateCoin,
    addClaimedTask,
    updateUserData,
    level,
    ReferralClaimDBHandler,
    fetchLevels,
    SocialMediaClaimDBHandler,
  } = useContext(UserDataContext);
  const { updateCoinValue } = useContext(CoinContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLevels();
      setLevels(data.Levels);
    };

    fetchData();
  }, []);

  console.log(userData);

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

  if (loading) {
    return <Loader />;
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

  const SocialMediaHandler = (id) => {
    const activeData = socialData.find((data) => data.id === id);
    setSoialModalData(activeData);
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
                  <p className="font-bold text-sm">100,000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!socialModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinYoutube}
                  onClick={() => {
                    setSoialModal(!socialModal);
                    SocialMediaHandler("youtube");
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
                    setSoialModal(!socialModal);
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
                  <p className="font-bold text-sm">100,00 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!socialModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinTelegram}
                  onClick={() => {
                    setSoialModal(!socialModal);
                    SocialMediaHandler("telegram");
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
                    setSoialModal(!socialModal);
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
                  <p className="font-bold text-sm">100,000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!socialModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinInstagram}
                  onClick={() => {
                    setSoialModal(!socialModal);
                    SocialMediaHandler("instagram");
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
                    setSoialModal(!socialModal);
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
                  <p className="font-bold text-sm">100,000 Coins</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {!socialModal ? (
                <svg
                  className="h-6"
                  disabled={!userData.joinTwitter}
                  onClick={() => {
                    setSoialModal(!socialModal);
                    SocialMediaHandler("twitter");
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
                    setSoialModal(!socialModal);
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
        
        {/* levels  */}
        <div>
          <div className="text-center text-2xl font-bold mt-4">Levels</div>
          <div className="space-y-2">
            {levels.slice(level, level + 3).map((le, index) => (
              <div
                key={level.id}
                className="space-y-2 border border-orange-400 shadow-md px-2 py-1 rounded-lg"
              >
                <div className="flex justify-between">
                  <div>
                    <img
                      src={imageData[level - 1 + index].image}
                      alt=""
                      className="h-8"
                    />
                  </div>
                  <div>
                    <button
                      className="bg-orange-400 text-white px-4 py-1 rounded-md font-bold"
                      disabled={
                        userData.maxCoin > levels[level - 1 + index].end
                      }
                      // onClick={() => handleBuy(boost)}
                    >
                      Claim
                    </button>
                  </div>
                </div>
                <div className="w-full border-orange-500 border-2  rounded-lg ">
                  <div className="h-4 bg-orange-500 rounded-lg">
                    <div
                      className="flex items-center h-full bg-progress-bar rounded-lg text-white"
                      style={{
                        width: `${
                          (userData.maxCoin / levels[level - 1 + index].end) *
                          100
                        }%`,
                      }}
                    >
                      {userData.maxCoin + "/" + levels[level - 1 + index].end}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {socialModal && (
        <div className="fixed z-40 inset-0 flex items-end justify-center bg-custom-gradient-tapgame transition-opacity duration-300">
          <div
            className={`relative bg-custom-gradient-tapgame rounded-t-lg w-screen shadow-lg h-screen transition-transform duration-300`}
          >
            <div className="flex flex-col items-center justify-center mx-16 space-y-3 h-[80%]">
              <div>
                <img src={socialModalData.image} className="h-40" alt="" />
              </div>
              <div className="text-center text-2xl font-bold">
                {socialModalData?.heading}
              </div>
              <div className="text-center">{socialModalData?.description}</div>
              <div className="flex space-x-2 font-bold items-center">
                <img src={dollar} className="h-8" alt="" />
                <h1 className="text-xl">+100,000</h1>
              </div>

              <div>
                <button className="text-white font-bold text-xl bg-orange-400 px-4 py-1 border-white border-2 shadow-md rounded-sm">{socialModalData?.button1}</button>
              </div>

              <div>
                <button className="text-white font-bold text-xl bg-orange-400 px-28 py-2 border-white border-2 shadow-md rounded-sm">{socialModalData?.button2}</button>
              </div>
            </div>
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
