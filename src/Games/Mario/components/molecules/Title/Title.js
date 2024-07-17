import "./Title.css";

// assets
import Mario from "../../../assets/img/mario.png";

const Title = () => {
  return (
    <div className="title-container  mt-20">
        <img src={Mario} alt="" className="mario-logo"/>
        <h1 className="  text-golden   text-3xl">Mario Jump</h1>
    </div>
  )
}
export default Title;