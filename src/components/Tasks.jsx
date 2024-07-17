import React, { useState, useContext, useEffect } from 'react';
import ShareBalance from './ShareBalance';
import tick from '../assets/tick.png';
import coin from '../Games/Assets/coin.png';
import level1 from "../assets/levels/level1.png";
import level2 from "../assets/levels/level2.png";
import level3 from "../assets/levels/level3.png";
import level4 from "../assets/levels/level4.png";
import level5 from "../assets/levels/level5.png";
import level6 from "../assets/levels/level6.png";
import SpecialTaskPopup from './SpecialTaskPopup';
import boy from '../assets/boy.png';
import flash from '../assets/flash.png';
import { UserDataContext } from '../Utils/userDataContext';
import { firestore } from '../Utils/remote';
import { CoinContext } from '../Utils/coinContext';
import Loader from './Loader'; // Import the Loader component
import BottomNavBar from './BottomNavBar';

function Tasks() {
  const [loading, setLoading] = useState(true); // Add loading state
  const [activeTab, setActiveTab] = useState('special');
  const [showSpecialTaskPopup, setShowSpecialTaskPopup] = useState(false);
  const [selectedSpecialTask, setSelectedSpecialTask] = useState(null);
  const [tasks, setTasks] = useState({ special: [], leagues: [], ref: [] });
  const { userData, getMaxCoin, updateCoin, addClaimedTask, updateUserData } = useContext(UserDataContext);
  const { updateCoinValue } = useContext(CoinContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await firestore.collection('tasks').get();
        const tasksData = tasksSnapshot.docs.reduce((acc, doc) => {
          const task = doc.data();
          const category = task.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({ ...task, id: doc.id });
          return acc;
        }, {});

        const userSnapshot = await firestore.collection('users').doc(localStorage.getItem("chatId")).get();
        const userClaimedTasks = userSnapshot.data().claimedTasks || [];

        // Mark tasks as claimed if they are in user's claimedTasks
        if (userClaimedTasks) {
          Object.keys(tasksData).forEach(category => {
            tasksData[category] = tasksData[category].map(task => ({
              ...task,
              claimed: userClaimedTasks.includes(task.id),
            }));
          });
        }

        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
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
      console.error('Error claiming task:', error);
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
    if (task.category === 'ref') {
      return userData.referralCount >= task.requiredInvites;
    } else if (task.category === 'leagues') {
      return getMaxCoin() >= task.required;
    }
    return false;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-10 overflow-hidden">
      <ShareBalance view={1} />
      <div className='text-white h-[0.09px] my-4 opacity-10 bg-white'></div>
      <div className="flex justify-center mb-4 border space-x-2 border-golden rounded-lg p-1 chakra-petch-medium">
        <button
          className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'special' ? 'backdrop-blur-sm bg-golden/10 text-white' : 'text-white'}`}
          onClick={() => handleTabChange('special')}
        >
          Special
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'leagues' ? 'backdrop-blur-sm bg-golden/10 text-white' : 'text-white'}`}
          onClick={() => handleTabChange('leagues')}
        >
          Leagues
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'ref' ? 'backdrop-blur-sm bg-golden/10 text-white' : 'text-white'}`}
          onClick={() => handleTabChange('ref')}
        >
          Ref's
        </button>
      </div>
      <div className="overflow-y-scroll h-80">
        {activeTab === 'special' && (
          tasks[activeTab].slice(0, 10).map((task) => (
            <div
              key={task.id}
              className={`flex items-center mb-2 rounded-md backdrop-blur-sm  bg-golden/10 cursor-pointer ${task.claimed ? 'opacity-50' : ''}`}
              onClick={() => handleSpecialTaskClick(task)}
            >
              <div className="mr-1">
                <img src={flash} alt="" className="w-8  m-3" />
              </div>
              <div className="flex-grow">
                <h3 className="text-md font-bold text-golden">{task.title}</h3>
                <p className="text-white">{task.reward} Coins</p>
              </div>
              <button
                className="bg-golden mr-2 text-black font-bold py-2 px-4 rounded-3xl ml-auto"
                disabled={task.claimed}
              >
                Open
              </button>
            </div>
          ))
        )}

{activeTab === 'ref' && (
  tasks[activeTab].slice(0, 10).map((invite) => (
    <div
      key={invite.id}
      className={`flex flex-col items-start rounded-md backdrop-blur-sm bg-golden/10 mb-2 relative p-6 ${invite.claimed ? 'opacity-50' : ''}`}
    >
      <div className="flex">
        <div className="flex">
          <div className="relative">
            <img src={boy} alt={invite.name} className="h-10" />
          </div>
          <div className="flex-grow relative">
            <h3 className="text-sm font-bold text-golden">{`Invite ${invite.requiredInvites} Friends`}</h3>
            <p className="text-sm text-white">{invite.reward} coins</p>
          </div>
        </div>
        <button
          className="bg-zinc-800  text-white font-bold py-1 px-4 mr-5 mt-2 rounded-3xl absolute top-4 right-2"
          style={{
            opacity: isTaskClaimable(invite) ? 1 : 0.4,
          }}
          onClick={() => handleClaim(invite)}
          disabled={!isTaskClaimable(invite) || invite.claimed}
        >
          Claim
        </button>
      </div>

      <div className="w-full bg-transparent rounded-full relative mt-2 overflow-hidden">
        <div className="h-4 bg-gray-200 rounded-full">
          <div
            className="h-full bg-golden rounded-full"
            style={{
              width: `${Math.min((userData.referralCount / invite.requiredInvites) * 100, 100)}%`,
            }}
          ></div>
        </div>
        <div className="text-center text-black text-xs font-medium absolute py-2 -top-2 left-4">
          <p>
            {Math.min(userData.referralCount, invite.requiredInvites)}/{invite.requiredInvites}
          </p>
        </div>
      </div>
    </div>
  ))
)}

        {activeTab === 'leagues' && (
          tasks[activeTab].map((level) => (
            <div
              key={level.id}
              className={`flex flex-col items-start rounded-md backdrop-blur-sm mb-2 bg-golden/10 relative p-6 ${level.claimed ? 'opacity-50' : ''}`}
              >
                <div className="flex">
                  <div className="flex">
                    <div className="relative">
                      <img src={getLevelImage(level.name)} alt={level.name} className="h-10" />
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
                        width: `${Math.min((userData.coin / level.required) * 100, 100)}%`,
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
            ))
          )}
        </div>
        {showSpecialTaskPopup && (
           <SpecialTaskPopup
           task={selectedSpecialTask}
           onClose={handleCloseSpecialTaskPopup}
           onClaim={handleClaim}
         />
        )}
      
      </div>
    );
  }
  
  export default Tasks;
  
  const getLevelImage = (levelName) => {
    switch (levelName) {
      case 'Level1':
        return level1;
      case 'Level2':
        return level2;
      case 'Level3':
        return level3;
      case 'Level4':
        return level4;
      case 'Level5':
        return level5;
      case 'Level6':
        return level6;
      default:
        return ''; // Default image or empty string if no image found
    }
  };
  