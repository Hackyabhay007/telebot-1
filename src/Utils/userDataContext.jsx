import React, { createContext, useState, useEffect } from 'react';
import { firestore } from './remote';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    claimedTasks: [],
  coin: 0,
  maxCoin: 0,
  referralCount: 0,
  refs: [], 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatId = localStorage.getItem('chatId');
        const docRef = firestore.collection('users').doc(chatId ? chatId : 'defaultId');
        const doc = await docRef.get();
        if (doc.exists) {
          const userData = doc.data();
          setUserData({
            claimedTasks: userData.claimedTasks || [],
            coin: userData.coin || 0,
            maxCoin: userData.maxCoin || 0,
            referralCount: userData.referralCount || 0,
            refs: userData.refs || [], // Add this line
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    const unsubscribe = firestore.collection('users').onSnapshot(() => {
      fetchData(); // Re-fetch data on Firestore snapshot changes
    });

    return () => unsubscribe(); // Unsubscribe from snapshot listener on component unmount
  }, []);

  const updateUserInFirestore = (newUserData) => {
    const userId = localStorage.getItem('chatId');
    if (userId) {
      firestore
        .collection('users')
        .doc(userId)
        .set(newUserData)
        .then(() => {
          console.log('User data updated in Firestore');
        })
        .catch((error) => {
          console.error('Error updating user data in Firestore: ', error);
        });
    } else {
      console.error('User ID not found');
    }
  };

  const updateUserData = (newData) => {
    const newUserData = { ...userData, ...newData };
    setUserData(newUserData);
    updateUserInFirestore(newUserData);
  };

  const incrementReferralCount = () => {
    const newReferralCount = (userData.referralCount || 0) + 1;
    updateUserData({ referralCount: newReferralCount });
  };

  const decrementReferralCount = () => {
    const newReferralCount = Math.max((userData.referralCount || 0) - 1, 0);
    updateUserData({ referralCount: newReferralCount });
  };

  const getReferralCount = () => {
    return userData.refs.length || 0;
  };

  const addClaimedTask = (taskId) => {
    const newClaimedTasks = [...(userData.claimedTasks || []), taskId];
    updateUserData({ claimedTasks: newClaimedTasks });
  };

  const removeClaimedTask = (taskId) => {
    const newClaimedTasks = (userData.claimedTasks || []).filter((id) => id !== taskId);
    updateUserData({ claimedTasks: newClaimedTasks });
  };


  const addRef = async (refId) => {
    try {
      const currentUserId=localStorage.getItem('chatId')
      const userDocRef = firestore.collection('users').doc(refId);
      const userDoc = await userDocRef.get();
  
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.refs && userData.refs.includes(currentUserId)) {
          // Referral ID already exists, no need to add it
          return;
        }
  
        // Referral ID doesn't exist, add it to the refs array
        if (userData.refs) {
          // Check if the new referral ID already exists in the refs array
          if (!userData.refs.includes(currentUserId)) {
            
            const newRefs = [...(userData.refs || []), currentUserId];
      await userDocRef.update({ refs: newRefs });

            } else {
              console.error('User ID not found');
            }
          
        } else {
          const newRefs = [...(userData.refs || []), currentUserId];
          // If the refs array doesn't exist, create a new one with the new referral ID
          await userDocRef.update({ refs: newRefs });
        }
      } 
    } catch (error) {
      console.error('Error adding referral:', error);
    }
  };
  
  
  
  const getRefs = () => {
    return userData.refs || [];
  };
  
  const getCoin = () => {
    return userData.coin || 0;
  };

  const updateCoin = (newCoinValue) => {
    console.log(newCoinValue);
    const numericCoinValue = Number(newCoinValue);
    updateUserData({
      coin: numericCoinValue,
      maxCoin: Math.max(numericCoinValue, userData.maxCoin || 0),
    });
  };
  const getMaxCoin = () => {
    return userData.maxCoin || 0;
  };

  const updateMaxCoin = (newMaxCoinValue) => {
    updateUserData({ maxCoin: newMaxCoinValue });
  };

  const fetchTotalUsers = async () => {
    try {
      const usersSnapshot = await firestore.collection('users').get();
      return usersSnapshot.size;
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };

  return (
    <UserDataContext.Provider
    value={{
      fetchTotalUsers,
      userData,
      updateUserData,
      incrementReferralCount,
      decrementReferralCount,
      getReferralCount,
      addClaimedTask,
      removeClaimedTask,
      getCoin,
      updateCoin,
      getMaxCoin,
      updateMaxCoin,
      addRef, 
      getRefs, 
    }}
  >
    {children}
  </UserDataContext.Provider>
  );
};