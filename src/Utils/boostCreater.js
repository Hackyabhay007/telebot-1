import { firestore } from "./remote";
// Function to create a task in Firebase Firestore
export const createBoost = async (boostData) => {
  try {
    // Add the task document to the 'tasks' collection in Firestore
    await firestore.collection("boost").add(boostData);
    // console.log("Boost created successfully:", boostData);
    return true; // Return true to indicate success
  } catch (error) {
    console.error("Error creating task:", error);
    return false; // Return false to indicate failure
  }
};

// Create special tasks

const dailyBoost = [
  {
    id: 1,
    name: "10x",
    description: "You will get 10 Coins Per Tap For 1 min",
    time: 60,
    activated: false,
    cost: 0,
  },
  {
    id: 2,
    name: "20x",
    description: "You will get 20 Coins Per Tap For 1 min",
    time: 60,
    activated: false,
    cost: 0,
  },
];

export const createDailyBoost = async () => {
  // Create each special task
  for (const boost of dailyBoost) {
    const success = await createBoost({
      type: "daily",
      ...boost,
    });
    if (success) {
      console.log(`Special task "${boost.name}" created successfully!`);
    } else {
      console.log(`Failed to create special task "${boost.name}"`);
    }
  }
};

export const getDailyBoost = async () => {
  try {
    // Get all documents from the 'boost' collection
    const snapshot = await firestore.collection("boost").get();
    const boosts = [];

    snapshot.forEach((doc) => {
      boosts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    if (boosts.length === 0) {
      createDailyBoost();
      return dailyBoost;
    }
    return boosts.sort((a, b) => a.id - b.id); // Return the array of boost objects
  } catch (error) {
    console.error("Error getting boosts:", error);
    return []; // Return an empty array in case of error
  }
};

// ----------------------------------------------------paid boost-------------------------------------------
const paidBoost = [
  {
    id: 1,
    name: "AutoTap",
    description: "AutoTap for 5 seconds",
    time: 5000,
    limit: 1,
    activated: false,
    startDay: new Date().getDate(),
    nextDay: new Date().getDate() + 1,
    cost: 1000,
  },
  {
    id: 2,
    name: "10x AutoTap",
    description: "You will get 10 Coins Per Tap For 5 seconds",
    time: 5000,
    limit: 1,
    activated: false,
    startDay: new Date().getDate(),
    nextDay: new Date().getDate() + 1,
    cost: 5000,
  },
  {
    id: 3,
    name: "50x AutoTap",
    description: "You will get 50 Coins Per Tap For 5 seconds",
    time: 5000,
    limit: 1,
    activated: false,
    startDay: new Date().getDate(),
    nextDay: new Date().getDate() + 1,
    cost: 3000,
  },
  {
    id: 4,
    name: "100x AutoTap",
    description: "You will get 100 Coins Per Tap For 5 seconds",
    time: 0,
    limit: 1,
    activated: false,
    startDay: new Date().getDate(),
    nextDay: new Date().getDate() + 1,
    cost: 100,
  },
  {
    id: 5,
    name: "Full Energy",
    description:
      "Recharge your enengy to the maximum and do another round of mining",
    time: 0,
    limit: 1,
    activated: false,
    startDay: new Date().getDate(),
    nextDay: new Date().getDate() + 1,
    cost: 100,
  },
];

export const createpaidBoost = async (boostData) => {
  try {
    // Add the task document to the 'tasks' collection in Firestore
    await firestore.collection("paidboost").add(boostData);
    // console.log("Boost created successfully:", boostData);
    return true; // Return true to indicate success
  } catch (error) {
    console.error("Error creating task:", error);
    return false; // Return false to indicate failure
  }
};

export const createPaidBoost = async () => {
  // Create each special task
  for (const boost of paidBoost) {
    const success = await createpaidBoost({
      type: "paid",
      ...boost,
    });
    if (success) {
      // console.log(`Special task "${boost.name}" created successfully!`);
    } else {
      console.log(`Failed to create special task "${boost.name}"`);
    }
  }
};

export const getPaidBoost = async () => {
  try {
    // Get all documents from the 'boost' collection
    const snapshot = await firestore.collection("paidboost").get();
    const boosts = [];

    snapshot.forEach((doc) => {
      boosts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // console.log("Boosts retrieved successfully:", boosts);
    if (boosts.length === 0) {
      createPaidBoost();
      return paidBoost;
    }
    return boosts.sort((a, b) => a.id - b.id); // Return the array of boost objects
  } catch (error) {
    console.error("Error getting boosts:", error);
    return []; // Return an empty array in case of error
  }
};

// export const deleteAllBoosts = async () => {
//   try {
//     // Get all documents from the 'boost' collection
//     const snapshot = await firestore.collection("paidboost").get();

//     // Create a batch to perform multiple deletions
//     const batch = firestore.batch();

//     // Add each document deletion to the batch
//     snapshot.forEach(doc => {
//       batch.delete(doc.ref);
//     });

//     // Commit the batch
//     await batch.commit();

//     console.log("All boosts deleted successfully");
//     return true; // Return true to indicate success
//   } catch (error) {
//     console.error("Error deleting all boosts:", error);
//     return false; // Return false to indicate failure
//   }
// };

// deleteAllBoosts()

// export const listAllBoosts = async () => {
//   try {
//     const snapshot = await firestore.collection("paidboost").get();
//     const boosts = [];

//     snapshot.forEach((doc) => {
//       boosts.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     console.log("All boosts:", boosts);
//     return boosts;
//   } catch (error) {
//     console.error("Error listing boosts:", error);
//     return [];
//   }
// };

// // Usage example
// listAllBoosts().then((boosts) => {
//   console.log(boosts);
// });
