import React from "react";
import { MutatingDots } from "react-loader-spinner";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center  bg-custom-gradient-tapgame bg-opacity-75 z-50">
    <MutatingDots
      visible={true}
      height="100"
      width="100"
      color="#FA7A16"
      secondaryColor="#FA7A16"
      radius="10.5"
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  </div>
);

export default Loader;
