// src/components/Loader.js
import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center  bg-purple-950 bg-opacity-75 z-50">
    {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-golden"></div> */}
    <MutatingDots
  visible={true}
  height="100"
  width="100"
  color="#EDC042"
  secondaryColor="#EDC042"
  radius="10.5"
  ariaLabel="mutating-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
  </div>
);

export default Loader;
