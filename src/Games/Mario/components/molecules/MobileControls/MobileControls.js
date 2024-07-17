import "./MobileControls.css";
import { useSelector, useDispatch } from "react-redux";
import { setReady, setScore, setLastScore } from "../../../config/redux/engineSlice";
import { marioJumping } from "../../../config/redux/marioSlice";
import { useMemo } from "react";
import jumpAudio from "../../../assets/audio/mario-jump.mp3";

const MobileControls = () => {
  const isPlay = useSelector((state) => state.engine.play);
  const mario_jump = useSelector((state) => state.mario.jumping);
  const isDie = useSelector((state) => state.engine.die);
  const dispatch = useDispatch();
  const score = useSelector(state => state.engine.score);
  const jump = useMemo(() => {
    return new Audio(jumpAudio);
  }, []);

  const handleStart = () => {
    if (!isPlay && !isDie) {
      dispatch(setReady(true));
      dispatch(setScore(0));
    }
  };

  const handleJump = () => {
    if (mario_jump === false) {
      dispatch(marioJumping(true));
      jump.play();
      setTimeout(() => {
        dispatch(marioJumping(false));
        jump.pause();
        jump.currentTime = 0;
      }, 400);
    }
  };

  return (
    <div className="mobile-controls-container  w-full">
      {!isPlay && !isDie && (
        <button className=" bg-golden  chakra-petch-bold px-18 py-2 text-2xl rounded-full  w-2/4 text-black " onClick={handleStart}>
          START
        </button>
      )}
     
      {/* {isDie && !isPlay && <button className=" bg-red-700 p-4 chakra-petch-bold  text-2xl rounded-full  w-2/4 text-white ">GAME OVER</button>} */}
      {isPlay && !isDie && <button className=" bg-golden p-4 chakra-petch-bold  text-black text-2xl rounded-full  w-2/4 " onClick={handleJump}>JUMP</button>}
    </div>
  );
};

export default MobileControls;
