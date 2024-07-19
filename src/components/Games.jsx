import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShareBalance from '../components/ShareBalance';
import Loader from '../components/Loader'; // Import the Loader component
import coin from '../assets/dcoin.png';
import mario from '../assets/marionrun.png';

const Games = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500 ); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }

  return (
    <div className="h-full text-white flex flex-col items-center font-display w-full">
      <div className="mt-2 w-4/5">
        <ShareBalance />
      </div>
      <h1 className="text-4xl font-display mb-4 chakra-petch-bold">Play Games</h1>
      <ul className="space-y-4 w-full flex flex-col items-center overflow-auto">
        <li className="w-full flex justify-center">
          <Link
            to="/games/tapcoin"
            className="w-8/10 flex flex-col items-center backdrop-blur-sm bg-white/10 text-3xl text-golden p-4 rounded-lg shadow-lg transform transition-transform hover:scale-90"
          >
            <img src={coin} className="w-24" alt="" />
            <span className="chakra-petch-bold">Tap Coin</span>
          </Link>
        </li>
        {/* <li className="w-full flex justify-center">
          <Link
            to="/games/mariorun"
            className="w-8/10 flex flex-col items-center backdrop-blur-sm bg-white/10 text-3xl text-golden p-4 rounded-lg shadow-lg transform transition-transform hover:scale-90"
          >
            <img src={mario} className="w-24" alt="" />
            <span className="chakra-petch-bold">Mario Run</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Games;
