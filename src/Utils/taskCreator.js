import { firestore  } from "./remote";
// Function to create a task in Firebase Firestore
export const createTask = async (taskData) => {
    try {
      // Add the task document to the 'tasks' collection in Firestore
      await firestore.collection('tasks').add(taskData);
      console.log('Task created successfully:', taskData);
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error creating task:', error);
      return false; // Return false to indicate failure
    }
  };

// Create special tasks
export const createSpecialTasks = async () => {
  const specialTasks = [
    { name: 'Special Task 1', reward: 100 },
    { name: 'Special Task 2', reward: 200 },
    { name: 'Special Task 3', reward: 300 },
  ];

  // Create each special task
  for (const task of specialTasks) {
    const success = await createTask({
      type: 'special',
      name: task.name,
      reward: task.reward,
    });
    if (success) {
      console.log(`Special task "${task.name}" created successfully!`);
    } else {
      console.log(`Failed to create special task "${task.name}"`);
    }
  }
};

// Create invite tasks
export const createInviteTasks = async () => {
  const inviteTasks = [];

  for (let i = 1; i <= 10000; i++) {
    inviteTasks.push({
      type: 'invite',
      name: `Invite Task ${i}`,
      reward: 100,
      requiredInvites: i,
    });
  }

  // Create each invite task
  for (const task of inviteTasks) {
    const success = await createTask(task);
    if (success) {
      console.log(`Invite task "${task.name}" created successfully!`);
    } else {
      console.log(`Failed to create invite task "${task.name}"`);
    }
  }
};

// Create league tasks
export const createLeagueTasks = async () => {
  const leagueTasks = [
    { name: 'League Task 1', reward: 5000, requiredCoins: 5000 },
    { name: 'League Task 2', reward: 10000, requiredCoins: 10000 },
    { name: 'League Task 3', reward: 20000, requiredCoins: 20000 },
    // Add more league tasks as needed
  ];

  // Create each league task
  for (const task of leagueTasks) {
    const success = await createTask({
      type: 'league',
      name: task.name,
      reward: task.reward,
      requiredCoins: task.requiredCoins,
    });
    if (success) {
      console.log(`League task "${task.name}" created successfully!`);
    } else {
      console.log(`Failed to create league task "${task.name}"`);
    }
  }
};


