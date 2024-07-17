import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSpring, animated } from 'react-spring'; // Import the react-spring library for animations

const WalletGenerator = ({ showPopup = false }) => {
  const [walletId, setWalletId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [shouldShowPopup, setShouldShowPopup] = useState(showPopup);

  const popupProps = useSpring({
    opacity: shouldShowPopup ? 1 : 0,
    transform: shouldShowPopup ? 'translateY(0)' : 'translateY(-50px)',
  });

  useEffect(() => {
    // Generate a new wallet when the component mounts
    generateWallet();
  }, []);

  const generateWallet = () => {
    try {
      // Create a new wallet
      const wallet = ethers.Wallet.createRandom();

      // Set the wallet ID, passphrase, and private key
      setWalletId(wallet.address);
      setPassphrase(wallet.mnemonic.phrase);
      setPrivateKey(wallet.privateKey);

      // Get the wallet address
      setWalletAddress(wallet.address);
      setShouldShowPopup(true);
    } catch (error) {
      console.error('Error generating wallet:', error);
    }
  };

  const closePopup = () => {
    setShouldShowPopup(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-700">
      {shouldShowPopup && (
        <animated.div style={popupProps} className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="popup-content backdrop-blur-md bg-border border-golden bg-white/10 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl text-white font-bold mb-4">Your New Wallet</h2>
            <p className="mb-4 text-white">Wallet Address: <span className="font-mono">{walletId}</span></p>
            <p className="mb-4 text-white">Passphrase: <span className="font-mono">{passphrase}</span></p>
            <p className="mb-4 text-white">Private Key: <span className="font-mono">{privateKey}</span></p>

            <button className="bg-golden text-black py-2 px-4 rounded-full" onClick={closePopup}>Close</button>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default WalletGenerator;
