import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScore, setLastScore } from "../../../config/redux/engineSlice";
import "./Score.css";

const Score = () => {
  const score = useSelector(state => state.engine.score);
  const lastScore = useSelector(state => state.engine.lastScore);
  const play = useSelector(state => state.engine.play);
  const die = useSelector(state => state.engine.die);
  const dispatch = useDispatch();

  useEffect(() => {
    if (play && !die) {
      setTimeout(() => {
        dispatch(setScore(score + 1));
      }, 500);
    }
    if (score && !play) {
      dispatch(setLastScore(score));
    }
  }, [dispatch, play, score, lastScore, die]);
  return (
    <div className="score-container font-mario">

      {play && <p className="score">Coins: {score}</p>}
      {!play && <p className="score">Last Score: {lastScore}</p>}
    </div>
  )
}
export default Score