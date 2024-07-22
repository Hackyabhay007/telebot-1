import React, { createContext, useState, useEffect } from "react";
import { firestore } from "./remote";
import DailyReward from "../Pages/DailyReward";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    claimedTasks: [],
    coin: 0,
    maxCoin: 0,
    referralCount: 0,
    refs: [],
    limit10x: 3,
    limit20x: 3,
    startDay10x: new Date().getDate(),
    nextDay10x: new Date().getDate() + 1,
    startDay20x: new Date().getDate(),
    nextDay20x: new Date().getDate() + 1,
    DailyReward: [],
  });

  const [level, setLevel] = useState(1);
  const [users, setUsers] = useState([]);
  const [levelsData, setLevelsData]= useState ([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatId = localStorage.getItem("chatId");
        const docRef = firestore
          .collection("users")
          .doc(chatId ? chatId : "defaultId");
        const doc = await docRef.get();
        if (doc.exists) {
          const userData = doc.data();
          console.log(userData);
          setUserData({ ...userData });
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();

    const unsubscribe = firestore.collection("users").onSnapshot(() => {
      fetchData(); // Re-fetch data on Firestore snapshot changes
    });

    return () => unsubscribe(); // Unsubscribe from snapshot listener on component unmount
  }, []);

  const updateUserInFirestore = (newUserData) => {
    const userId = localStorage.getItem("chatId");
    if (userId) {
      firestore
        .collection("users")
        .doc(userId)
        .set(newUserData)
        .then(() => {
          console.log("User data updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating user data in Firestore: ", error);
        });
    } else {
      console.error("User ID not found");
    }
  };

  const levelNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
  ];

  const levelMinPoints = [
    0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 5000000,
    6500000,
  ];

  useEffect(() => {
    if (localStorage.getItem("chatId")) {
      if (userData) {
        if (userData.maxCoin < 500000) {
          setLevel(1);
        } else if (userData.maxCoin >= 500000 && userData.maxCoin < 1000000) {
          setLevel(2);
        } else if (userData.maxCoin >= 1000000 && userData.maxCoin < 1500000) {
          setLevel(3);
        } else if (userData.maxCoin >= 1500000 && userData.maxCoin < 2000000) {
          setLevel(4);
        } else if (userData.maxCoin >= 2000000 && userData.maxCoin < 2500000) {
          setLevel(5);
        } else if (userData.maxCoin >= 2500000 && userData.maxCoin < 3000000) {
          setLevel(6);
        } else if (userData.maxCoin >= 3000000 && userData.maxCoin < 3500000) {
          setLevel(7);
        } else if (userData.maxCoin >= 3500000 && userData.maxCoin < 5000000) {
          setLevel(8);
        } else if (userData.maxCoin >= 5000000 && userData.maxCoin < 6500000) {
          setLevel(9);
        } else if (userData.maxCoin >= 6500000) {
          setLevel(10);
        }
      }
    }
  }, [userData]);

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
    const newClaimedTasks = (userData.claimedTasks || []).filter(
      (id) => id !== taskId
    );
    updateUserData({ claimedTasks: newClaimedTasks });
  };

  const addRef = async (refId) => {
    try {
      const currentUserId = localStorage.getItem("chatId");
      const userDocRef = firestore.collection("users").doc(refId);
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
            console.error("User ID not found");
          }
        } else {
          const newRefs = [...(userData.refs || []), currentUserId];
          // If the refs array doesn't exist, create a new one with the new referral ID
          await userDocRef.update({ refs: newRefs });
        }
      }
    } catch (error) {
      console.error("Error adding referral:", error);
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

  const updateBoostLimit = (data) => {
    console.log(data);
    updateUserData(data);
  };

  const getMaxCoin = () => {
    return userData.maxCoin || 0;
  };

  const updateMaxCoin = (newMaxCoinValue) => {
    updateUserData({ maxCoin: newMaxCoinValue });
  };

  const fetchTotalUsers = async () => {
    try {
      const usersSnapshot = await firestore.collection("users").get();
      return usersSnapshot.size;
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  useEffect(() => {
    if (
      userData.nextDay10x == new Date().getDate() ||
      userData.nextDay20x == new Date().getDate()
    ) {
      const data = {
        startDay10x: new Date().getDate(),
        nextDay10x: new Date().getDate() + 1,
        startDay20x: new Date().getDate(),
        nextDay20x: new Date().getDate() + 1,
        limit10x: 3,
        limit20x: 3,
      };
      updateUserData(data);
    }
  }, []);

  const fetchUsers = async (specificUserId) => {
    try {
      const usersRef = firestore.collection("users");

      // Fetch top three users
      const topThreeSnapshot = await usersRef
        .orderBy("maxCoin", "desc")
        .limit(3)
        .get();
      let topUsers = topThreeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Check if the specific user is in the top three
      const specificUserIndex = topUsers.findIndex(
        (user) => user.id === specificUserId
      );

      if (specificUserIndex === -1) {
        // Specific user is not in the top three, fetch their data
        const specificUserDoc = await usersRef.doc(specificUserId).get();
        if (specificUserDoc.exists) {
          const specificUserData = {
            id: specificUserDoc.id,
            ...specificUserDoc.data(),
          };
          topUsers.push(specificUserData);
        }
      }

      // Fetch one more user if we need to ensure we have four users total
      if (topUsers.length < 4) {
        const additionalUsersSnapshot = await usersRef
          .orderBy("maxCoin", "desc")
          .offset(3)
          .limit(1)
          .get();
        additionalUsersSnapshot.forEach((doc) => {
          topUsers.push({ id: doc.id, ...doc.data() });
        });
      }

      setUsers(topUsers.slice(0, 4)); // Ensure we have exactly four users
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const createTotalBalanceDitributed = async () => {
    try {
      // Add the task document to the 'tasks' collection in Firestore
      await firestore.collection("TotalBalance").add({
        totalBalance: 1000000,
        onlineUsers: 500,
        total: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Error creating task:", error);
      return false; // Return false to indicate failure
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const totalBalanceSnapshot = await firestore
        .collection("TotalBalance")
        .get();

      if (totalBalanceSnapshot.empty) {
        console.log("No total balance found.");
        createTotalBalanceDitributed();
        return null; // Return null if no documents are found
      }

      // Assuming there's only one document in the collection
      const totalBalanceDoc = totalBalanceSnapshot.docs[0];
      const totalBalanceData = totalBalanceDoc.data();

      console.log("Total balance:", totalBalanceData);
      return totalBalanceData.totalBalance;
    } catch (error) {
      console.error("Error fetching total balance:", error);
      return null; // Return null to indicate failure
    }
  };

  const ReferralClaimDBHandler = async (data) => {
    const userId = localStorage.getItem("chatId");
    const newUserData = { ...userData, data };
    if (userId) {
      firestore
        .collection("users")
        .doc(userId)
        .set(newUserData)
        .then(() => {
          console.log("User data updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating user data in Firestore: ", error);
        });
    } else {
      console.error("User ID not found");
    }
  };

  const SocialMediaClaimDBHandler = (newData) => {
    const newUserData = { ...userData, ...newData };
    setUserData(newUserData);
    console.log(newUserData);
    // updateUserInFirestore(newUserData);
  };

  const Levels = [
    {
      id: 1,
      start: 0,
      end: 500000,
    },
    {
      id:2 , 
      start:500000,
      end:1000000,
    },
    {
      id:3 , 
      start:10000000,
      end:1500000,
    },
    {
      id:4 , 
      start:1500000,
      end:2000000,
    },
    {
      id:5 , 
      start:2000000,
      end:2500000,
    },
    {
      id:6 , 
      start:2500000,
      end:3000000,
    },
    {
      id:7 , 
      start:3000000,
      end:3500000,
    },
    {
      id:8 , 
      start:3500000,
      end:4000000,
    },
    {
      id:9 , 
      start:4000000,
      end:4800000,
    },
    {
      id:10 , 
      start:4800000,
      end:5600000,
    },
    {
      id:11 , 
      start:5600000,
      end:6400000,
    },
    {
      id:12 , 
      start:6400000,
      end:7200000,
    },
    {
      id:13 , 
      start:7200000,
      end:8000000,
    },
    {
      id:14 , 
      start:8000000,
      end:8800000,
    },
    {
      id:15 , 
      start:8800000,
      end:9600000,
    },
    {
      id:16 , 
      start:9600000,
      end:10400000,
    },
    {
      id:17 , 
      start:10400000,
      end:11200000,
    }
  ];

  const createLevels = async () => {
    try {
      // Add the task document to the 'tasks' collection in Firestore
      await firestore.collection("Levels").add({Levels});
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Error creating levels:", error);
      return false; // Return false to indicate failure
    }
  };

  const fetchLevels = async () => {
    try {
      const levelsSnapshot = await firestore
        .collection("Levels")
        .get();

      if (levelsSnapshot.empty) {
        console.log("No levels found.");
        createLevels();
        return Levels; // Return null if no documents are found
      }

      // Assuming there's only one document in the collection
      const levelsDoc = levelsSnapshot.docs[0];
      const levelsData = levelsDoc.data();

      console.log("Total levels:", levelsData);
      return levelsData;
    } catch (error) {
      console.error("Error fetching total balance:", error);
      return null; // Return null to indicate failure
    }
  };

  useEffect( ()=>{
    fetchLevels ()
  })


  return (
    <UserDataContext.Provider
      value={{
        fetchLevels , 
        SocialMediaClaimDBHandler,
        ReferralClaimDBHandler,
        fetchTotalBalance,
        level,
        users,
        fetchUsers,
        setLevel,
        updateBoostLimit,
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
