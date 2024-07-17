import React, { createContext, useState, useEffect } from "react";
import { firestore } from "../Utils/remote"; // Import your Firestore configuration
import { useLoading } from "../Utils/LoadingContext";
export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coinValue, setCoinValue] = useState(0); // Initial coin value
  const [maxCoin, setMaxCoin] = useState(0); // Initial coin value
  const [activeBoost, setActiveBoost] = useState(null);
  const [tapPerCoin , setTapPerCoin]=useState(1)

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
    updateCoinInFirestore(amount, Math.max(maxCoin, amount));
    setCoinValue(amount);
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
        setTapPerCoin
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
