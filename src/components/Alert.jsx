// CustomAlert.js
import React from 'react';

const Alert = ({ message, onClose }) => {
  console.log("dfsdfdfsdfdsfddf")
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border-2 border-black p-6 text-center rounded-lg shadow-lg">
        <p>{message}fgfdgdfgfdgdfgfdgdfg</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Alert;
