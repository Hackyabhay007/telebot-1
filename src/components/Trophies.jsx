import React, { useState } from "react";
import level1 from "../assets/levels/level1.png";
import level2 from "../assets/levels/level2.png";
import level3 from "../assets/levels/level3.png";
import level4 from "../assets/levels/level4.png";
import level5 from "../assets/levels/level5.png";
import level6 from "../assets/levels/level6.png";

const Levels = () => {
  const [level, setLevel] = useState(1);
  const shoeImages = [level1, level2, level3, level4, level5, level6];

  const getCoinsForLevel = (level) => {
    switch (level) {
      case 1:
        return 5000;
      case 2:
        return 10000;
      case 3:
        return 20000;
      case 4:
        return 40000;
      case 5:
        return 80000;
      case 6:
        return 5000000;
      default:
        return 0;
    }
  };

  const handleLeftClick = () => {
    if (level > 1) {
      setLevel(level - 1);
    }
  };

  const handleRightClick = () => {
    if (level < 6) {
      setLevel(level + 1);
    }
  };

  const handleCloseClick = () => {
    // Add your close button logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="trophy-shoe-case relative">
        <h1 className="absolute top-0 left-1/2 chakra-petch-bold text-white transform -translate-x-1/2 text-3xl font-bold">
          {`Level ${level}`}
        </h1>
        <button
          className="absolute left-0 ml-4 top-1/2 transform -translate-y-1/2 bg-zinc-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLeftClick}
        >
          &lt;
        </button>
        <button
          className="absolute right-0 mr-4  top-1/2 transform -translate-y-1/2 bg-zinc-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRightClick}
        >
          &gt;
        </button>
        <div className="m-7 text-center">
          <p className="text-white font-bold py-2 px-4 chakra-petch-bold rounded">
            Coins You Will Receive After Reaching Level:{" "}
            {getCoinsForLevel(level)}
          </p>
          <img
            className="mt-9 shadow-lg rounded-lg w-64 h-64 object-contain mx-auto"
            src={shoeImages[level - 1]}
            alt={`Shoe at level ${level}`}
          />
        </div>
        {/* <button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCloseClick}
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Levels;