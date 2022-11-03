import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update, child, remove } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import React from 'react';




/*****
 *  
 * Configurations
 *
*****/

const firebaseConfig = {
  apiKey: "AIzaSyCo0gPK4fEqqPd5WgmhISKfy1P8AgPmf3Y",
  authDomain: "purduezilla.firebaseapp.com",
  databaseURL: "https://purduezilla-default-rtdb.firebaseio.com",
  projectId: "purduezilla",
  storageBucket: "purduezilla.appspot.com",
  messagingSenderId: "1043168052788",
  appId: "1:1043168052788:web:be5443766ed89f9479ac61",
  measurementId: "G-9G4NCBXCZX"
};

// Initialze firebase
const app = initializeApp(firebaseConfig);
// Initialize analytics
const analytics = getAnalytics(app);
//initialize db
const db = getDatabase(app);
//auth
const auth = getAuth();

/*****
 *  
 * Write functions
 *
*****/

// Create new user in our db
// Does not authenticate user: must also call createAccount() for authentication
// kyle: it is called only when createAccount returns true, this assures that the email is not duplicated
const createNewUser = function createNewUser(email, firstName, lastName, profileDescription = "", notificationSetting = "") {
  const userListRef = ref(db, 'users');
  const newUserRef = push(userListRef);
  set(newUserRef, {
    email: email,
    firstName: firstName,
    lastName: lastName,
    profileDescription: profileDescription,
    notificationSetting: notificationSetting,
  });

  return newUserRef.key;
}

// Create new group
const createNewGroup = function createNewGroup(name, memberIds, ownerIds, projectIds) {

  const groupListRef = ref(db, 'groups');
  const newGroupRef = push(groupListRef);
  set(newGroupRef, {
    name: name
  });

  // Add owner user Id's
  for (const i in ownerIds) {
    addNewOwnerToGroup(newGroupRef.key, ownerIds[i])
  }

  // Add member user Id's
  for (const i in memberIds) {
    addNewMemberToGroup(newGroupRef.key, memberIds[i]);
  }

  // Add member user Id's
  for (const i in projectIds) {
    addNewProjectToGroup(newGroupRef.key, projectIds[i]);
  }

  return newGroupRef.key;
}

const addNewOwnerToGroup = function addNewOwnerToGroup(groupKey, userId) {
  const ownersListRef = ref(db, 'groups/' + groupKey + '/owners');
  const userRef = push(ownersListRef);
  set(userRef, {
    userId: userId
  });
}

const addNewMemberToGroup = function addNewMemberToGroup(groupKey, userId) {
  const membersListRef = ref(db, 'groups/' + groupKey + '/members');
  const userRef = push(membersListRef);
  set(userRef, {
    userId: userId
  });  
}

const addNewProjectToGroup = function addNewProjectToGroup(groupKey, projectId) {
  const ownersListRef = ref(db, 'groups/' + groupKey + '/projects');
  const projectRef = push(ownersListRef);
  set(projectRef, {
    projectId: projectId
  });  
}

//create new comments
const createNewComment = function createNewComment(body, authorKey, taskKey, taggedKeys) {
  const taskRef = ref(db, `tasks/${taskKey}/comments`);
  const newCommentRef = push(taskRef);
  set(newCommentRef, {
    body: body,
    author: authorKey,
  });

  let newRef;
  let userRef;
  const userRefList = ref(db, 'users/');
  let userRefObjects = {};
  onValue(userRefList, (snapshot) => {
    let child1 = snapshot.val();
    for (var key in child1) {
      userRefObjects[child1[key].email] = key;
    }
  })


  taggedKeys.forEach(function (key) {
    if (userRefObjects[key]) {
      userRef = ref(db, `users/${key}/tagged`);
      newRef = push(userRef);
      set(newRef, {
        taskKey: taskKey,
        commentKey: newCommentRef.key,
        author: authorKey,
        body: body
      });
    }
  });

  return { body: body, author: authorKey };
}

//get the comments for a task
const getTaskComments = function getTaskComments(taskKey) {
  // console.log("called function " + taskKey);
  const taskRef = ref(db, `tasks/${taskKey}/comments/`);
  // console.log("called function pt2");
  const returnedTasks = [];
  // console.log("iterate");
  onValue(taskRef, (snapshot) => {
    let child = snapshot.val();
    for (var key in child) {
      returnedTasks.push(child[key]);
    }
  });
  // console.log("finish getting nothing");
  // console.log(returnedTasks);
  return returnedTasks;

}

//returns comment key, task key, and body for comments that have tagged the user
const getTaggedComments = function getTaggedComments(userKey) {
  const returnedComments = []
  const commentRef = ref(db, `users/${userKey}/tagged/`);
  onValue(commentRef, (snapshot) => {
    let child = snapshot.val();
    for (var key in child) {
      returnedComments.push(child[key]);
    }
  })
  return returnedComments;
}

// Create new project
// To get all tasks associated with project, query 'tasks' by project id
const createNewProject = function createNewProject(name, description, status, memberIds, ownerIds) {

  const projectListRef = ref(db, 'projects');
  const newProjectRef = push(projectListRef);
  set(newProjectRef, {
    name: name,
    description: description,
    status: status
  });

  // Add owner user Id's
  for (const i in ownerIds) {
    addProjectOwner(newProjectRef.key, ownerIds[i])
  }

  // Add member user Id's
  for (const i in memberIds) {
    addProjectMember(newProjectRef.key, memberIds[i]);
  }

  return newProjectRef.key;

}

/**
 * Adds a list of people as owner of a project
 * @param {*} id of a project
 * @param {*} ownerId 
 */
const addProjectOwner = (id, ownerId) => {
    const ownersListRef = ref(db, 'projects/' + id + '/owners');
    const userRef = push(ownersListRef);
    set(userRef, {
        userId: ownerId
    });
}

/**
 * Adds a list of people as members of a project
 * @param {*} id 
 * @param {*} memberId 
 */
const addProjectMember = (id, memberIds) => {
    const memberListRef = ref(db, 'projects/' + id + '/members');
    set(memberListRef, memberIds)
}

// Create new task
// permittedUserIds, ownerIds, assignedUserIds, followerIds must be arrays
const createNewTask = function createNewTask(projectId, name, description, estimatedTime, status, ownerIds, assignedUserIds, followerIds) {

  // Create basic task
  const taskListRef = ref(db, 'tasks');
  const newTaskRef = push(taskListRef);
  console.log(ownerIds)
  set(newTaskRef, {
    projectId: projectId,
    name: name,
    description: description,
    estimatedTime: estimatedTime,
    assignedUsers: assignedUserIds,
    owners: ownerIds,
    status: status,
    assignedUsers: assignedUserIds,
    followers: followerIds
  });


  // // Add owner user Id's
  // const ownersListRef = ref(db, 'tasks/' + newTaskRef.key + '/owners');
  // const userRef = push(ownersListRef);
  // set(userRef, {
  //   userId: ownerIds[i]
  // });
  // for (const i in ownerIds) {
  //     const userRef = push(ownersListRef);
  //     set(userRef, {
  //         userId: ownerIds[i]
  //     });
  // }

  // Add assigned user Id's
  // const assignedUserListRef = ref(db, 'tasks/' + newTaskRef.key + '/assignedUsers');
  // for (const i in assignedUserIds) {
  //     const userRef = push(assignedUserListRef);
  //     set(userRef, {
  //         userId: assignedUserIds[i]
  //     });
  // }

  // Add follower user Id's
  // const followersListRef = ref(db, 'tasks/' + newTaskRef.key + '/followers');
  // const followers = []

  // followerIds.forEach(function(child) {
  //     const followerid = getUserid(child)
  //     console.log("newUser: " + child + " " + followerid)
  // })

  // return newTaskRef.key;

    // Add owner user Id's
    addTaskOwners(newTaskRef.key, ownerIds)

    // Add assigned user Id's
    addTaskAssignedUsers(newTaskRef.key, assignedUserIds)

    // Add follower user Id's
    addTaskFollowers(newTaskRef.key, followerIds)

    return newTaskRef.key;

}

const addTaskOwners = (taskId, ownerIds) => {
    const ownersListRef = ref(db, 'tasks/' + ownerIds + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        push(userRef, {
            userId: ownerIds[i]
        });
    }
}

const addTaskAssignedUsers = (taskId, assignedUserIds) => {
    const assignedUserListRef = ref(db, 'tasks/' + taskId + '/assignedUsers');
    for (const i in assignedUserIds) {
        const userRef = push(assignedUserListRef);
        push(userRef, {
            userId: assignedUserIds[i]
        });
    }
}

const addTaskFollowers = (taskId, followerIds) => {
    const followersListRef = ref(db, 'tasks/' + taskId + '/followers');
    for (const i in followerIds) {
        const userRef = push(followersListRef);
        set(userRef, {
            userId: followerIds[i]
        });
    }

}

const addTaskHistoryEvent = (taskId, description) => {
  const ref = ref(db, 'tasks/' + taskId + '/history');
  const newHistoryRef = push(ref);
    set(newHistoryRef, {
      description: description
    });
}

const addProjectHistoryEvent = (projectId, description) => {
  const ref = ref(db, 'projects/' + projectId + '/history');
  const newHistoryRef = push(ref);
    set(newHistoryRef, {
      description: description
    });
}

/*****
 *  
 * Query functions
 *
*****/

// Returns 2d array with each element as [taskKey, values]
const getProjectsTasks = function getProjectsTasks(projectId) {
  const tasksInProject = []

  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().projectId == projectId) {
        // Keep track of task key and task's values
        tasksInProject.push([childSnapshot.key, childSnapshot.val()]);
      }
    })
  });

  return tasksInProject;
}

// Returns 2d array with each element as [projectKey, values]
const getUsersProjects = function getUsersProjects(userId) {
  const usersProjects = []

  onValue(ref(apiFunctions.db, 'projects'), (snapshot) => {
    snapshot.forEach(function (projectSnapshot) {
      onValue(ref(apiFunctions.db, "projects/" + projectSnapshot.key + '/members'), (snapshot2) => {
        snapshot2.forEach(function (memberSnapshot) {
          if (memberSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersProjects.push([projectSnapshot.key, projectSnapshot.val()]);
          }
        });
      });
    })  
  });

  return usersProjects;
}

// Returns 2d array with each element as [taskKey, values]
const getUsersAssignedTasks = function getUsersAssignedTasks(userId) {
  const usersAssignedTasks = []

  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
    snapshot.forEach(function (taskSnapshot) {
      onValue(ref(apiFunctions.db, "tasks/" + taskSnapshot.key + '/assignedUsers'), (snapshot2) => {
        snapshot2.forEach(function (userSnapshot) {
          if (userSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersAssignedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
          }
        });
      });
    })
  });

  return usersAssignedTasks;
}

// Returns 2d array with each element as [taskKey, values]
const getUsersFollowedTasks = function getUsersFollowedTasks(userId) {
  const usersFollowedTasks = []

  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
    snapshot.forEach(function (taskSnapshot) {
      onValue(ref(apiFunctions.db, "tasks/" + taskSnapshot.key + '/followers'), (snapshot2) => {
        snapshot2.forEach(function (userSnapshot) {
          if (userSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersFollowedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
          }
        });
      });
    })
  });

  return usersFollowedTasks;
}

// Returns 2d array with each element as [projectKey, values]
const getGroupsProjects = function getGroupsProjects(groupId) {
  const groupsProjects = []

  onValue(ref(apiFunctions.db, 'groups/' + groupId + "/projects"), (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      groupsProjects.push([childSnapshot.key, childSnapshot.val()]);
    })
  });

  return groupsProjects;
}

const getProjectById = function getProjectById(projectId) {
  const projectInfo = []

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    projectInfo.push([projectId, snapshot.val()]);
  });

  return projectInfo;
}

const getTaskById = function getTaskById(taskId) {
  const taskInfo = []

  onValue(ref(apiFunctions.db, 'tasks/' + taskId), (snapshot) => {
    taskInfo.push([taskId, snapshot.val()]);
  });

  return taskInfo;
}

const getUserById = function getUserById(userId) {
  const userInfo = []

  onValue(ref(apiFunctions.db, 'users/' + userId), (snapshot) => {
    userInfo.push([userId, snapshot.val()]);
  });

  return userInfo;
}

const getUserByEmail = function getUserByEmail(email) {
  const userInfo = []

  onValue(ref(apiFunctions.db, 'users'), (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().email == email) {
        userInfo.push([childSnapshot.key, childSnapshot.val()]);
      }
    })
  });

  return userInfo;
}

// Returns T/F
const isTaskOwner = function isTaskOwner(userId, taskId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "tasks/" + taskId + '/owners'), (snapshot) => {
    snapshot.forEach(function (userSnapshot) {
      if (userSnapshot.val().userId == userId) {
        isOwner.push(1);
      }
    });
  });

  if (isOwner.length == 0) {
    return false;
  }
  return true;
}

// Returns T/F
const isProjectOwner = function isProjectOwner(userId, projectId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "projects/" + projectId + '/owners'), (snapshot) => {
    snapshot.forEach(function (userSnapshot) {
      if (userSnapshot.val().userId == userId) {
        isOwner.push(1);
      }
    });
  });

  if (isOwner.length == 0) {
    return false;
  }
  return true;
}

// Returns T/F
const isGroupOwner = function isGroupOwner(userId, groupId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "groups/" + groupId + '/owners'), (snapshot) => {
    snapshot.forEach(function (userSnapshot) {
      if (userSnapshot.val().userId == userId) {
        isOwner.push(1);
      }
    });
  });

  if (isOwner.length == 0) {
    return false;
  }
  return true;
}


/**
 * Given the id of a user, updates all of its properties with new data 
 * from the parameter
 * @param {string} id 
 * @param {string} email 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {*} profileDescription 
 * @param {*} notificationSetting 
 * @returns the id of the updated user
 */
const updateUser = (id, email, firstName, lastName, profileDescription, notificationSetting = "") => {
    const userListRef = ref(db, 'users/' + id);
    update(userListRef, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        profileDescription: profileDescription,
        notificationSetting: notificationSetting,
    });

    return userListRef.key;
}

/**
 * Updates only the project details
 * @param {*} id 
 * @param {*} name 
 * @param {*} description 
 * @param {*} status 
 * @returns id of the updated project details
 */
const updateProjectDetails = (id, name, description, status) => {
    const projectListRef = ref(db, 'projects/' + id);

    onValue(projectListRef, (snapshot) => {
        const oldName = snapshot.val().name;
        if (oldName != name) {
        const historyDescription = "Name updated.\nDate: " + new Date() + "\nPrevious name: " + oldName;
            addProjectHistoryEvent(id, historyDescription);
        }
        const oldDescription = snapshot.val().description;
        if (oldDescription != description) {
        const historyDescription = "Description updated.\nDate: " + new Date() + "\nPrevious description: " + oldDescription;
            addProjectHistoryEvent(id, historyDescription);
        }
        const oldStatus = snapshot.val().status;
        if (oldStatus != status) {
        const historyDescription = "Status updated.\nDate: " + new Date() + "\nPrevious status: " + oldStatus;
            addProjectHistoryEvent(id, historyDescription);
        }
    });

    update(projectListRef, {
        name: name,
        description: description,
        status: status
    });

    return projectListRef.key;
}

/**
 * Given the id of a project, remove a list of people from being an owner
 * @param {*} id 
 * @param {*} exOwnerIds 
 */
 const deleteProjectOwners = (id, exOwnerIds) => {
    exOwnerIds.forEach(owner => {
        remove(ref(db, "Projects/" + id + "/owners/" + owner))
        .catch((error) => {
            console.log(error)
        })
    });
}

/**
 * Given the id of a project, rmeove a list of people from being a member
 * @param {*} id 
 * @param {*} exMemberIds 
 */
const deleteProjectMembers = (id, exMemberIds) => {
    exMemberIds.forEach(memberId => {
        remove(ref(db, "Projects/" + id + "/members/" + memberId))
        .catch((error) => {
            console.log(error)
        })
    })
}

/**
 * Updates a task detail. This will overwrite all existing data
 * @param {*} id 
 * @param {*} projectId 
 * @param {*} name 
 * @param {*} description 
 * @param {*} estimatedTime 
 * @param {*} status 
 * @returns 
 */
const updateTaskDetails = (id, projectId, name, description, estimatedTime, status) => {
    const taskListRef = ref(db, 'tasks/'  + id);

    onValue(taskListRef, (snapshot) => {
        const oldName = snapshot.val().name;
        if (oldName != name) {
        const historyDescription = "Name updated.\nDate: " + new Date() + "\nPrevious name: " + oldName;
            addTaskHistoryEvent(id, historyDescription);
        }
        const oldDescription = snapshot.val().description;
        if (oldDescription != description) {
        const historyDescription = "Description updated.\nDate: " + new Date() + "\nPrevious description: " + oldDescription;
            addTaskHistoryEvent(id, historyDescription);
        }
        const oldStatus = snapshot.val().status;
        if (oldStatus != status) {
        const historyDescription = "Status updated.\nDate: " + new Date() + "\nPrevious status: " + oldStatus;
            addTaskHistoryEvent(id, historyDescription);
        }
    });

    update(taskListRef, {
        projectId: projectId,
        name: name,
        description: description,
        estimatedTime: estimatedTime,
        status: status,
    })

    return taskListRef.key
}

const deleteTaskOwners = (id, exOwnerIds) => {
    exOwnerIds.forEach(owner => {
        remove(ref(db, "tasks/" + id + "/owners/" + owner))
        .catch((error) => {
            console.log(error)
        })
    })
}

const deleteTaskAssignedUsers = (id, exAssignedUserIds) => {
    exAssignedUserIds.forEach(au => {
        remove(ref(db, "tasks/" + id + "/assignedUsers/" + au))
        .catch((error) => {
            console.log(error)
        })
    })
}

const deleteTaskFollowers = (id, exFollowerIds) => {
    exFollowerIds.forEach(follower => {
        remove(ref(db, "tasks/" + id + "/followers/" + follower))
        .catch((error) => {
            console.log(error)
        })
    })
}
/*****
 *  
 * Auth functions
 *
*****/

/* Asynchronous function that returns true or false with a message based
 * on the results from firebase.createUserWithEmailAndPassword
 * @param {string} email        email entered by the user in the textfield
 * @param {string} password     password entered by the user in the textfield
 */
async function tryCreateAccount(email, password) {
  //maybe initialize outside? -PJ
  //const auth = getAuth();
  let result = createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // We need to set user in context
      const user = userCredential.user;
      // for now print out user
      return { status: true, msg: "OK" };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //change these later to actually do something meaningfull
      console.log(errorCode);
      console.log(errorMessage);
      return { status: false, msg: error.message };
    });
  return result;
}

/*  Asynchronous function that returns true or false based on the
 *  results from firebase.signInWithEmailAndPassword
 *  @param {string} email       email entered by the user in the textfield
 *  @param {string} password    password entered by the user in the textfield
 */
const trySignInAccount = async (email, password) => {
  //also maybe initialize outside
  //const auth = getAuth();
  let result = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // user credential is correct, now signed in
      const user = userCredential.user;
      // TODO: return user information together with the boolean
      return { status: true, msg: "OK" };
    }).catch((error) => {
      // user crednetial not found
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      return { status: false, msg: error.message };
    });
  return result
}

//sign out account
const signOutAccount = () => {
  //once again probably initialize outside
  //const auth = getAuth();
  signOut(auth).then(() => {
    console.log("signed out successfully");
  }).catch((error) => {
    console.log("wasn't able to sign out :(");
  });
}

//context stuff

const FirebaseAuthContext = React.createContext();
const FireBaseDispatchContext = React.createContext();

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  //const value = { user };

  React.useEffect(() => {
    //const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("poopo");
        // console.log(user);
        // console.log("find user");
        const searcher = user.email;
        const userListRef = ref(db, 'users');
        onValue(userListRef, (snapshot) => {
          snapshot.forEach(function (child) {
            const printing = child.val();
            console.log("key");
            console.log(child.key);
            // console.log(printing.email);
            // console.log(searcher);
            // console.log(printing.email === searcher);
            if (printing.email === searcher) {
              const saved = {
                info: {
                  email: printing.email,
                  firstName: printing.firstName,
                  profileDescription: printing.profileDescription,
                  notificationSetting: printing.notificationSetting
                }, key: child.key
              };
              setUser(saved);
            }
          })
        });
      }
      else {
        setUser(null);
      }
    });
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user }}>
      <FireBaseDispatchContext.Provider value={setUser}>
        {children}
      </FireBaseDispatchContext.Provider>
    </FirebaseAuthContext.Provider>
  );
};

function useFirebaseAuth() {
  const context = React.useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  console.log("haha");
  console.log(context);
  return context.user;
}

function useFirebaseDispatch() {
  const context = React.useContext(FireBaseDispatchContext);
  if (context === undefined) {
    throw new Error('dispatch must be used within Firebase Dispatch');
  }
  return context;
}


//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
  createNewUser,
  createNewGroup,
  addNewOwnerToGroup,
  addNewProjectToGroup,
  createNewProject,
  addProjectOwner,
  addProjectMember,
  addTaskAssignedUsers,
  addTaskFollowers,
  addTaskOwners,
  createNewTask,
  getGroupsProjects,
  getProjectsTasks,
  getUsersProjects,
  getUsersAssignedTasks,
  getUsersFollowedTasks,
  getUserById,
  getUserByEmail,
  getProjectById,
  getTaskById,
  isTaskOwner,
  isGroupOwner,
  isProjectOwner,
  tryCreateAccount,
  trySignInAccount,
  signOutAccount,
  updateUser,
  updateProjectDetails,
  deleteProjectOwners,
  deleteProjectMembers,
  updateTaskDetails,
  deleteTaskAssignedUsers,
  deleteTaskFollowers,
  deleteTaskOwners,
  db,
  app,
  FirebaseAuthProvider, useFirebaseAuth, useFirebaseDispatch,
  getTaskComments, getTaggedComments, createNewComment,
  auth
};

export default apiFunctions;
