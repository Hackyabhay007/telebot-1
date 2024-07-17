import React from 'react';

const Boosts = ({ boosts, showObstacles, toggleObstacles, doubleScore, toggleDoubleScore }) => (
  <div className=" bg-gray-100 overflow-hidden">
    <h3 className="text-lg font-bold mb-4">Available Boosts</h3>
    <div className="mb-4 flex items-center">
      <button
        onClick={toggleObstacles}
        className="px-2 py-1 mr-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
      >
        {showObstacles ? 'Hide' : 'Show'}
      </button>
      <button
        onClick={toggleDoubleScore}
        className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
      >
        {doubleScore ? 'Disable' : 'Enable'}
      </button>
    </div>
    <div className="flex flex-nowrap overflow-x-auto">
      {boosts.map((boost) => (
        <div
          key={boost.id}
          className="flex-shrink-0 flex items-center mb-2 p-3 bg-white rounded shadow mr-2"
        >
          <img className="h-8 w-8 mr-2" src={boost.image} alt={boost.name} />
          <div>
            <p className="font-semibold text-sm">{boost.name}</p>
            <p className="text-xs">Qty: {boost.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Boosts;
