import { useSpring, animated } from "react-spring";
import coin from "../Games/Assets/coin.png";
import { CoinContext } from "../Utils/coinContext";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../Utils/userDataContext";

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

  // Generate random values within specified ranges
  const totalShareBalance = getRandomNumber(1000000, 1000000000); // More than 1,000,000
  const dailyUsers = getRandomNumber(500, 5000); // 500 to 5000
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
    <div className="p-4 rounded-lg chakra-petch-bold overflow-hidden">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="p-4 rounded-lg">
            <div className="flex items-center mb-10 border text-black rounded-md border-golden bg-[#FFFFE5]">
              <img src={coin} className="h-24" alt="" />
              <div className="text-center">
                <h3 className="text-xl font-bold chakra-petch-bold text-golden">
                  Total Balance
                </h3>
                <p className="text-lg chakra-petch-bold  ">{coinValue}</p>
              </div>
            </div>
            <animated.div
              className=" mb-3 p-2 rounded-md border border-golden backdrop-blur-sm bg-[#FFFFE5]"
              style={level1Props}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-golden">Total Users</h3>
              </div>
              <p className="text-lg text-black chakra-petch-bold">
                {totalUsers}
              </p>
            </animated.div>
            <animated.div
              className="bg-[#FFFFE5] p-2 rounded-md border border-golden backdrop-blur-sm "
              style={level2Props}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-golden">Games Played</h3>
              </div>
              <p className="text-lg text-black chakra-petch-bold">
                {gamesPlayed.toLocaleString()}
              </p>
            </animated.div>
            <animated.div
              className="mt-3 p-2 rounded-md border border-golden backdrop-blur-sm bg-[#FFFFE5]"
              style={level3Props}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-golden">Online Users</h3>
              </div>
              <p className="text-lg text-black chakra-petch-bold">
                {onlineUsers.toLocaleString()}
              </p>
            </animated.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapSwapStats;
