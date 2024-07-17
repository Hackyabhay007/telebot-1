// BoostPurchasePopup.js

import React from 'react';
import coin from "../Games/Assets/coin.png";

const BoostPurchasePopup = ({ boost, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 bg-opacity-75 chakra-petch-bold">
      <div className="border-golden backdrop-blur-sm bg-golden/5 rounded-lg p-6 shadow-lg max-w-md relative border">
        <button
          className="absolute top-2 right-2 text-white text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-golden mb-4">{boost.name} Purchased</h2>
        <p className="text-white mb-4 chakra-petch-medium">{boost.description}</p>
        <div className='border-golden backdrop-blur-sm bg-golden/10 rounded-md p-2 flex'>
          <img src={coin} alt="coin" className='h-10 mr-2' />
          <div>
            <p className="text-white chakra-petch-regular">Price</p>
            <p className="text-white">{boost.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostPurchasePopup;
