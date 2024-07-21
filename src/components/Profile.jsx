import React, { useContext } from "react";
import profile from "../../src/assets/profile.png";
import { UserDataContext } from "../Utils/userDataContext";

const Profile = () => {
  const { userData } = useContext(UserDataContext);

  console.log(userData)
  return (
    <div className="flex space-x-4 ">
      <img
        className="p-0.5 border rounded-lg shadow-md shadow-orange-500  border-[#FA650F]"
        src={profile}
        alt="profile"
      />

      <div className="text-black ">{userData?.chatId} (you)</div>
    </div>
  );
};

export default Profile;
