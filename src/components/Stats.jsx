import { useSpring, animated } from "react-spring";
import { CoinContext } from "../Utils/coinContext";
import { Children, useContext, useEffect, useState } from "react";
import { UserDataContext } from "../Utils/userDataContext";
import dollar from "../../src/assets/dollar.png";
import BottomNavBar from "./BottomNavBar";
import Loader from "./Loader";

const TapSwapStats = () => {
  const { coinValue } = useContext(CoinContext);
  const { fetchTotalUsers, fetchTotalBalance, updateTotalBalanceDistributed } =
    useContext(UserDataContext);

  const [totalDistributedBalance, setTotalBalanceDistributedBalance] =
    useState(1000000);

  const [totalUsers, setTotalUsers] = useState(1000);
  const [onlineUsers, setOnlineUsers] = useState(500);
  const [gamesPlayed, setTotalGamesPlayed] = useState(100000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchTotalUsers();
      setTotalUsers(data);
    };

    fetchUsers();
  }, [fetchTotalUsers]);

  const totalBalance = async () => {
    const balance = await fetchTotalBalance();
    console.log(balance);
    return balance;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const data = totalBalance();
  //   console.log(data);
  //   setOnlineUsers(data.onlineUsers)
  //   setTotalBalanceDistributedBalance(data.totalBalance)
  //   setTotalUsers(data.total)
  // }, []);

  // Helper function to generate random numbers within a range
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // updating total balance distributed
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newNumber = getRandomNumber(500, 1000);
      setTotalBalanceDistributedBalance((prevScore) => prevScore + newNumber);
      const newUsers = getRandomNumber(1, 2);
      setTotalUsers((prevUsers) => prevUsers + newUsers);
      const newGames = getRandomNumber(100, 200);
      setTotalGamesPlayed((prevScore) => prevScore + newGames);
      const newOnlineUsers = getRandomNumber(-10, 10);
      setOnlineUsers((prevScore) => prevScore + newOnlineUsers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  if (isLoading) {
    return <Loader />; // Display the loader while the content is loading
  }

  return (
    <div className="rounded-lg chakra-petch-bold overflow-hidden pt-4">
      <div className="rounded-lg mx-4">
        <div className="items-center text-black mt-10 mb-20">
          <div className="text-center text-lg">Total Coin Distributed</div>
          <div className="flex justify-center items-center space-x-2">
            <img src={dollar} className="h-8 w-8" alt="Dollar" />
            <p className="text-4xl chakra-petch-bold">
              {totalDistributedBalance}
            </p>
          </div>
        </div>

        <animated.div
          className="text-black shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]"
          style={level1Props}
        >
          <div className="font-bold text-lg">Total Users</div>
          <p className="text-lg chakra-petch-bold">{totalUsers}</p>
        </animated.div>

        <animated.div
          className="text-black shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]"
          style={level2Props}
        >
          <div className="font-bold text-lg">Games Played</div>
          <p className="text-lg chakra-petch-bold">
            {gamesPlayed.toLocaleString()}
          </p>
        </animated.div>

        <animated.div
          className="text-black shadow-md mb-3 p-2 flex justify-between rounded-md border border-orange-400 backdrop-blur-sm bg-[#FDE5C1]"
          style={level3Props}
        >
          <div className="font-bold text-lg">Online Users</div>
          <p className="text-lg chakra-petch-bold">{onlineUsers}</p>
        </animated.div>
      </div>
      <div className="flex justify-center items-center">
        <BottomNavBar />
      </div>
    </div>
  );
};

export default TapSwapStats;
