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
import mine from "../../src/assets/mine.png"

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
    img: trophy,
  },
  {
    to: "/tasks",
    icon: <FaGamepad className="text-green-500 mb-2" />,
    label: "Earn",
    img: taskimg,
  },
  {
    to: "/stats",
    icon: <FaChartBar className="mb-2" />,
    label: "Stats",
    img: chart,
  },
];

const BottomNavBar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
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
    <div className="fixed bottom-3 w-full text-black">
      <div className="flex justify-around py-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            activeClassName="border border-white text-golden"
            className="text-black hover:text-white flex-grow flex-shrink "
            onClick={() => handleItemSelect(index)}
          >
            <div className="flex flex-col items-center">
              <div
                className={`rounded-3xl p-3 border-2 shadow-xl w-20  h-24 flex flex-col items-center justify-center ${
                  selectedItem === index
                    ? "backdrop-blur-sm bg-white/10 border border-golden"
                    : "bg-[#FFFFE5] "
                }`}
              >
                <img src={item.img} className="" />
                <span className="text-sm  font-bold">
                  {item.label}
                </span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;
