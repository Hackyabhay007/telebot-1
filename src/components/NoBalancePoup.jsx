import React from 'react';
import coin from '../Games/Assets/coin.png';

const NoBalancePopup = ({ coinValue, requiredAmount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75">
      <div className="border-golden m-5 backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border">
        <button
          className="absolute top-2 right-2 text-white text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-golden mb-4">Insufficient Balance</h2>
        <div className="flex items-center mb-4">
          <img src={coin} alt="Coin" className="h-8 mr-2" />
          <p className="text-white chakra-petch-medium">
            You have <span className="font-bold">{coinValue}</span> coins
          </p>
        </div>
        <p className="text-white mb-4 chakra-petch-medium">
          You need <span className="font-bold">{requiredAmount}</span> coins to purchase this boost.
        </p>
        <button
          className="bg-golden text-black hover:bg-zinc-800 justify-center font-bold py-2 px-4 rounded-3xl"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NoBalancePopup;
