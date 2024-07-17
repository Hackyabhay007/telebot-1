import React, { useState, useEffect } from 'react';
import coin from "../Games/Assets/coin.png";

const SpecialTaskPopup = ({ task, onClose, onClaim }) => {
  const [buttonStates, setButtonStates] = useState({});
  const [allButtonsChecked, setAllButtonsChecked] = useState(false);

  useEffect(() => {
    if (task.tasks && Object.keys(task.tasks).length > 0) {
      const totalTasks = Object.keys(task.tasks).filter(key => task.tasks[key].link).length;
      setAllButtonsChecked(Object.values(buttonStates).filter(state => state === 'checked').length === totalTasks);
    }
  }, [buttonStates, task.tasks]);

  const handleGoClick = (link, key) => {
    window.open(link, '_blank');
    setButtonStates(prevState => ({
      ...prevState,
      [key]: 'checking'
    }));

    setTimeout(() => {
      setButtonStates(prevState => ({
        ...prevState,
        [key]: 'checked'
      }));
    }, 5000);
  };

  const handleClaimClick = () => {
    onClaim(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75 chakra-petch-bold">
      <div className="border-golden backdrop-blur-sm bg-black/35 rounded-lg p-6 shadow-lg max-w-md relative border">
        <button
          className="absolute top-2 right-2 text-white text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-golden mb-4">{task.title}</h2>
        {task.description && (
          <p className="text-white mb-4 chakra-petch-medium">{task.description}</p>
        )}
        {task.reward && (
          <div className="border-golden backdrop-blur-sm bg-white/15 rounded-sm p-2 flex">
            <img src={coin} alt="" className="h-10 mr-2" />
            <div>
              <p className="text-white chakra-petch-regular">Reward</p>
              <p className="text-white">{task.reward}</p>
            </div>
          </div>
        )}
        {task.tasks && Object.keys(task.tasks).length > 0 && (
          <>
            <h3 className="text-lg font-bold text-yellow-500 mb-2">Tasks:</h3>
            <ol className="list-decimal list-inside mb-4 text-white">
              {Object.keys(task.tasks).map((key) => (
                <li key={key} className="mb-2 flex justify-between items-center">
                  <span>{task.tasks[key].title}</span>
                  {task.tasks[key].link && (
                    <button
                      onClick={() => handleGoClick(task.tasks[key].link, key)}
                      className="bg-golden hover:bg-yellow-700 text-zinc-900 font-bold px-6 rounded-full ml-3"
                      disabled={buttonStates[key] === 'checking' || buttonStates[key] === 'checked'}
                    >
                      {buttonStates[key] === 'checking' ? 'Checking' : buttonStates[key] === 'checked' ? 'Checked' : 'Go'}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
        {allButtonsChecked && (
          <button
            className="bg-golden hover:bg-yellow-700 text-zinc-900 font-bold px-6 py-2 rounded-full mt-4"
            onClick={handleClaimClick}
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
};

export default SpecialTaskPopup;
