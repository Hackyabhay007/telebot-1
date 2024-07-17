import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCZpt_ChtFUCu8Lx5WfSscj0kgSUT8sGE",
  authDomain: "hodlswap.firebaseapp.com",
  projectId: "hodlswap",
  storageBucket: "hodlswap.appspot.com",
  messagingSenderId: "1019700479813",
  appId: "1:1019700479813:web:d70b177b0134dddb11a02c",
  measurementId: "G-RRY5P9D649"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const generateWalletAddress = () => {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let walletAddress = '';

  for (let i = 0; i < 34; i++) { // Length of many cryptocurrency addresses (e.g., Bitcoin addresses)
    const randomChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
    walletAddress += randomChar;
  }

  return walletAddress;
};


export const createUser = async (userData) => {
  try {
    if (!userData || !userData.chatId) {
      throw new Error('Invalid user data or chatId');
    }

    const chatId = userData.chatId.trim();
    if (!chatId) {
      throw new Error('Chat ID cannot be empty');
    }

    const userDocRef = firestore.collection('users').doc(chatId);
    await userDocRef.set(userData);

    const createdUserDoc = await userDocRef.get();
    const createdUserData = createdUserDoc.data();
    localStorage.setItem('chatId', chatId);
    console.log('User created with ID:', chatId);
    console.log('User data:', createdUserData);

    return createdUserData;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const authenticateUserById = async (chatId) => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    const trimmedChatId = chatId.trim();
    if (!trimmedChatId) {
      throw new Error('Chat ID cannot be empty');
    }

    const userDoc = await firestore.collection('users').doc(trimmedChatId).get();
    console.error('User Searching......' + trimmedChatId);
    if (userDoc.exists) {
      // User found, save user ID in local or global storage
      console.log(userDoc)
      localStorage.setItem('chatId', trimmedChatId);

      // Optionally, you can return the user data or perform additional actions
      return userDoc.data();
    } else {
      // User not found
      console.error('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

export const getUserData = async () => {
  try {
    const chatId = localStorage.getItem('chatId');
    if (!chatId) {
      throw new Error('Chat ID not found in local storage');
    }

    const trimmedChatId = chatId.trim();
    if (!trimmedChatId) {
      throw new Error('Chat ID in local storage is empty');
    }

    const userDoc = await firestore.collection('users').doc(trimmedChatId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('User data retrieved:', userData);
      return userData; // Assuming the user document has a 'coin' field
    } else {
      console.error('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
