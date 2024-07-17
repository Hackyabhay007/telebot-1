// boostUtil.js
import { json } from 'react-router-dom';
import boost1Image from '../assets/boosts/star-dynamic-premium.png';
import boost2Image from '../assets/boosts/sun-dynamic-premium.png';
const BOOSTS_KEY = 'boosts1';
const USER_BALANCE_KEY = 'user_balance';

/**
 * Get all boosts from local storage.
 * @returns {Object} The boosts stored in local storage.
 */

/**
 * Get the quantity of a specific boost.
 * @param {string} game - The game for which the boost is being used.
 * @param {number} boostId - The ID of the boost.
 * @returns {number} The quantity of the boost.
 */
export const getBoostQuantity = (game, boostId) => {
  const boosts = getBoosts();
  if (boosts[game]) {
   
    const boost = boosts[game].find(b => b.id === boostId);
    console.log(boost);
    return boost ? boost.quantity : 0;
  }
  return 0;
};


export const getBoosts = () => {
  // const boosts = localStorage.getItem(BOOSTS_KEY);
  // return boosts ? JSON.parse(boosts) : {};
  return  {}
};

/**
 * Save boosts to local storage.
 * @param {Object} boosts - The boosts to save.
 */
export const saveBoosts = (boosts) => {
  localStorage.setItem(BOOSTS_KEY, JSON.stringify(boosts));
};

/**
 * Deduct the quantity of a boost.
 * @param {string} game - The game for which the boost is being used.
 * @param {number} boostId - The ID of the boost to deduct.
 * @returns {boolean} Whether the deduction was successful.
 */
export const deductBoost = (game, boostId) => {
  const boosts = getBoosts();
  if (boosts[game]) {
    const boostIndex = boosts[game].findIndex(b => b.id === boostId);
    if (boostIndex !== -1 && boosts[game][boostIndex].quantity > 0) {
      boosts[game][boostIndex].quantity -= 1;
      saveBoosts(boosts);
      return true;
    }
  }
  return false;
};


/**
 * Get the user's balance from local storage.
 * @returns {number} The user's balance.
 */
export const getUserBalance = () => {
  const balance = localStorage.getItem(USER_BALANCE_KEY);
  return balance ? parseInt(balance, 10) : 0;
};

/**
 * Save the user's balance to local storage.
 * @param {number} balance - The balance to save.
 */
export const saveUserBalance = (balance) => {
  localStorage.setItem(USER_BALANCE_KEY, balance.toString());
};

/**
 * Purchase a boost, updating the user's balance and the boosts.
 * @param {string} game - The game for which the boost is being purchased.
 * @param {Object} boost - The boost to purchase.
 * @returns {boolean} Whether the purchase was successful.
 */
export const purchaseBoost = (game, boost) => {
  const balance = getUserBalance();
  if (balance >= boost.price) {
    const boosts = getBoosts();
    if (!boosts[game]) {
      boosts[game] = [];
    }
    const existingBoost = boosts[game].find(b => b.id === boost.id);
    if (existingBoost) {
      existingBoost.quantity += 1;
    } else {
      boost.quantity = 1;
      boosts[game].push(boost);
    }
    saveBoosts(boosts);
    saveUserBalance(balance - boost.price);
    return true;
  }
  return false;
};

/**
 * Initialize default boosts and user balance in local storage.
 */
export const initializeData = (user_balance) => {
  const defaultBoosts = {
    TapCoin: [
      { id: 1, name: '10x Tap', description: 'You will get 10 Coins Per Tap For 1 minute', price: 0, image: boost1Image, quantity: 0 },
      { id: 2, name: '20X Tap', description: 'You will get 10 Coins Per Tap For 1 minute', price: 0, image: boost1Image, quantity: 0 },
    ],
    TapCoinPaidBooster:[
      { id: 1, name: '5x Tap', description: 'You will get 10 Coins Per Tap For 1 minute', price: 0, image: boost1Image, quantity: 0 },
      { id: 2, name: '20X Tap', description: 'You will get 10 Coins Per Tap For 1 minute', price: 0, image: boost1Image, quantity: 0 },

    ],
    MarioRun: [
      { id: 3, name: 'Double Coin', description: 'Double the coin generating speed', price: 290, image: boost2Image, quantity: 0 },
      { id: 4, name: 'No Obstacle', description: 'You Wont Get Obstacle For 10 Seconds', price: 650, image: boost2Image, quantity: 0 },
    ],
  };

  if (!localStorage.getItem(BOOSTS_KEY)) {
    saveBoosts(defaultBoosts);
  }
    saveUserBalance(user_balance); // Example starting balance
};
