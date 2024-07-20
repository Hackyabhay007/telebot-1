import { useSpring, animated } from "react-spring";
import { CoinContext } from "../Utils/coinContext";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../Utils/userDataContext";
import dollar from "../../src/assets/dollar.png";
import Profile from "./Profile";

const TapSwapStats = () => {
  const { coinValue } = useContext(CoinContext);
  const { fetchTotalUsers } = useContext(UserDataContext);

  const [totalUsers, setTotalUsers] = useState("");

  useEffect(async () => {
    const data = await fetchTotalUsers();
    setTotalUsers(data);
  }, []);

  // Helper function to generate random numbers within a range
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const gamesPlayed = getRandomNumber(1000000, 3000000); // 1,000,000 to 3,000,000
  const onlineUsers = getRandomNumber(500, 5000); // 500 to 5000

  const level1Props = useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 500,
  });

  const level2Props = useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 1000,
  });

  const level3Props = useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 1500,
  });

  return (
    <div className="mx-4 rounded-lg chakra-petch-bold overflow-hidden pt-4">
      <div className="rounded-lg">
        <Profile />

        <div className=" items-center   text-black mt-10 mb-20">
          <div className="text-center text-lg">Your Balance</div>
          <div className="flex justify-center items-center space-x-2">
            <img src={dollar} className="h-8 w-8" alt="" />
            <p className="text-4xl chakra-petch-bold  ">{coinValue}</p>
          </div>
        </div>

        <animated.div
          className="text-black  shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]
]"
          style={level1Props}
        >
          <div className="font-bold text-lg">Total Users</div>
          <p className="text-lg chakra-petch-bold">{totalUsers}</p>
        </animated.div>

        <animated.div
          className="text-black  shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]
]"
          style={level2Props}
        >
          <div className="font-bold text-lg">Games Played</div>
          <p className="text-lg chakra-petch-bold">
            {gamesPlayed.toLocaleString()}
          </p>
        </animated.div>

        <animated.div
          className="text-black  shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]
]"
          style={level3Props}
        >
          <div className="font-bold text-lg">Online Users</div>
          <p className="text-lg chakra-petch-bold">
            {onlineUsers.toLocaleString()}
          </p>
        </animated.div>
      </div>
    </div>
  );
};

export default TapSwapStats;
