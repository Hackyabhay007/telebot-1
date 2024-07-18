import React, { createContext, useState, useEffect } from "react";
import { firestore } from "../Utils/remote"; // Import your Firestore configuration
import { useLoading } from "../Utils/LoadingContext";
export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coinValue, setCoinValue] = useState(0); // Initial coin value
  const [maxCoin, setMaxCoin] = useState(0); // Initial coin value
  const [activeBoost, setActiveBoost] = useState(null);
  const [tapPerCoin , setTapPerCoin]=useState(100)
  const [dailyBoost , setDailyBoost]=useState([])
  const [paidBoost , setPaidBoost]=useState([])
  const [autoTap , setAutoTap]=useState(false);
  const [autoTapAmount , setAutoTapAmount]=useState(0)

  useEffect(() => {
    const chatid = localStorage.getItem("chatId");
    const unsubscribe = firestore
      .collection("users")
      .doc(chatid ? chatid : "qehjhdfuhdb")
      .onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          if (userData && userData.coin) {
            setCoinValue(userData.coin);
            setMaxCoin(userData.maxCoin);
          } else {
            console.error("User data or coin balance not found");
          }
        } else {
          console.error("User not found");
        }
      });

    return () => unsubscribe(); // Unsubscribe from snapshot listener on component unmount
  }, []);

  const updateCoinInFirestore = (newValue, maxval) => {
    const userId = localStorage.getItem("chatId");
    if (userId) {
      firestore
        .collection("users")
        .doc(userId)
        .update({
          coin: newValue,
          maxCoin: maxval,
        })
        .then(() => {
          console.log("Coin value updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating coin value in Firestore: ", error);
        });
    } else {
      console.error("User ID not found");
    }
  };

  const incrementCoin = (amount = 1) => {
    const newCoinValue = coinValue + amount;
    setCoinValue(newCoinValue);
    updateCoinInFirestore(newCoinValue, maxCoin + newCoinValue);
  };

  const decrementCoin = (amount = 1) => {
    const newCoinValue = Math.max(coinValue - amount, 0);
    setCoinValue(newCoinValue);
    updateCoinInFirestore(newCoinValue, maxCoin);
  };
  const updateCoinValue = (amount) => {
    console.log("Update coin value called")
    updateCoinInFirestore(amount, Math.max(maxCoin, amount));
    setCoinValue(amount);
  };

  const chatId=localStorage.getItem("chatId")

   const updateScore = async () => {
    try {
      const chatIdStr = String(chatId); // Ensure chatId is a string
  
      // Reference to the specific document in the 'userProgress' collection
      const userProgressRef = firestore.collection('userProgress').doc(chatIdStr);
  
      // Set the new data (overwrites existing document or creates a new one)
      await userProgressRef.set({
        timestamp: Date.now(), // Update timestamp to current time
        score: 1500 // Update score to newScore value
      });
  
      console.log(`Score updated for chat ID ${chatIdStr} to ${1500}`);
      return true; // Return true to indicate success
    } catch (error) {
      console.error(`Error updating score for chat ID ${chatId}:`, error);
      return false; // Return false to indicate failure
    }
  };

  return (
    <CoinContext.Provider
      value={{
        coinValue,
        incrementCoin,
        decrementCoin,
        updateCoinValue,
        activeBoost,
        setActiveBoost,
        tapPerCoin, 
        setTapPerCoin,
        dailyBoost, 
        setDailyBoost,
        paidBoost, 
        setPaidBoost,
        autoTap,
        setAutoTap,
        updateScore,
        autoTapAmount,
        setAutoTapAmount,
        setCoinValue,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
