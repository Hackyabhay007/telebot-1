/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaTrophy, FaGamepad, FaChartBar, FaRocket } from "react-icons/fa";
import taskimg from "../assets/tasks.png";
import trophy from "../assets/trophy.png";
import gamepad from "../assets/games.png";
import chart from "../assets/chart.png";
import fire from "../assets/fire.png";
import { useDispatch, useSelector } from "react-redux";
import { setDie } from "../Games/Mario/config/redux/engineSlice";
import mine from "../../src/assets/mine.png";
import group from "../../src/assets/group.png";
import earn from "../../src/assets/earn.png";
import stats from "../../src/assets/stats.png";

const navItems = [
  {
    to: "/games",
    icon: <FaChartBar className="text-green-500 mb-2" />,
    label: "Exchange",
    img: mine,
  },

  {
    to: "/referral",
    icon: <FaTrophy className="text-green-500 mb-2" />,
    label: "Friends",
    img: group,
  },
  {
    to: "/tasks",
    icon: <FaGamepad className="text-green-500 mb-2" />,
    label: "Earn",
    img: earn,
  },
  {
    to: "/stats",
    icon: <FaChartBar className="mb-2" />,
    label: "Stats",
    img: stats,
  },
];

const BottomNavBar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const isPlay = useSelector((state) => state.engine.play);
  const bgMusic = useRef(null);
  const marioDie = useRef(null);

  const handleItemSelect = (index) => {
    setSelectedItem(index);

    if (isPlay) {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
      marioDie.current.play();
    }
  };

  return (
    <div
      className="fixed bottom-2 w-full text-black z-50  bg-glass-bg/10 backdrop-blur  "
      // style={{
      //   backdropFilter: "blur(20px)",
      //   WebkitBackdropFilter: "blur(10px)",
      //   width: "100%",
      // }}
    >
      <div className="flex justify-around py-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            activeClassName="border border-white text-golden"
            className="text-black  flex-grow flex-shrink "
            onClick={() => handleItemSelect(index)}
          >
            <div className="flex flex-col items-center">
              <div
                className={` rounded-xl p-1 border-2 shadow-md shadow-orange-500 w-16  h-20 flex flex-col items-center justify-center bg-[#F9C399] border-[#FA650F]
]`}
              >
                <img src={item.img} className=" h-8" />
                <span className="text-sm  font-bold">{item.label}</span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;
