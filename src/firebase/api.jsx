import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update, child, remove } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";



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
const createNewGroup = function createNewGroup(name, memberIds, ownerIds) {
    
    const groupListRef = ref(db, 'groups');
    const newGroupRef = push(groupListRef);
    set(newGroupRef, {
        name: name
    });

    // Add owner user Id's
    const ownersListRef = ref(db, 'groups/' + newGroupRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add member user Id's
    const memberListRef = ref(db, 'groups/' + newGroupRef.key + '/members');
    for (const i in memberIds) {
        const userRef = push(memberListRef);
        set(userRef, {
            userId: memberIds[i]
        });
    }

    return newGroupRef.key;

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
    addProjectOwners(newProjectRef.key, ownerIds)

    // Add member user Id's
    addProjectMemebers(newProjectRef.key, memberIds)

    return newProjectRef.key;

}

/**
 * Adds a list of people as owner of a project
 * @param {*} id of a project
 * @param {*} ownerIds 
 */
const addProjectOwners = (id, ownerIds) => {
    const ownersListRef = ref(db, 'projects/' + id + '/owners');
    set(ownersListRef, ownerIds)
}

/**
 * Adds a list of people as members of a project
 * @param {*} id 
 * @param {*} memberIds 
 */
const addProjectMemebers = (id, memberIds) => {
    const memberListRef = ref(db, 'projects/' + id + '/members');
    set(memberListRef, memberIds)
}

// Create new task
// permittedUserIds, ownerIds, assignedUserIds, followerIds must be arrays
const createNewTask = function createNewTask(projectId, name, description, estimatedTime, status, ownerIds, assignedUserIds, followerIds) {

    // Create basic task
    const taskListRef = ref(db, 'tasks');
    const newTaskRef = push(taskListRef);
    set(newTaskRef, {
        projectId: projectId,
        name: name,
        description: description,
        estimatedTime: estimatedTime,
        status: status,
    });

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

/*****
 *  
 * Query functions
 *
*****/

// Returns 2d array with each element as [taskKey, values]
// call using snapshot of all tasks:
//  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
      // getProjectsTasks(projectId, snapshot)
//  });
const getProjectsTasks = function getProjectsTasks(projectId, snapshot) {
    const tasksInProject = []

    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().projectId == projectId) {
        // Keep track of task key and task's values
        tasksInProject.push([childSnapshot.key, childSnapshot.val()]);
      }
    })

    return tasksInProject;
}

// Returns 2d array with each element as [projectKey, values]
// call using snapshot of all projects:
//  onValue(ref(apiFunctions.db, 'projects'), (snapshot) => {
      // getUsersProjects(userId, snapshot)
//  });
const getUsersProjects = function getUsersProjects(userId, snapshot) {
    const usersProjects = []

    snapshot.forEach(function(projectSnapshot) {
      onValue(ref(apiFunctions.db, "projects/" + projectSnapshot.key + '/members'), (snapshot2) => {
        snapshot2.forEach(function(memberSnapshot) {
          if (memberSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersProjects.push([projectSnapshot.key, projectSnapshot.val()]);
          }
        });
      });
    })

    return usersProjects;
}

// Returns 2d array with each element as [taskKey, values]
// call using snapshot of all tasks:
//  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
      // getUsersAssignedTasks(userId, snapshot)
//  });
const getUsersAssignedTasks = function getUsersAssignedTasks(userId, snapshot) {
    const usersAssignedTasks = []

    snapshot.forEach(function(taskSnapshot) {
      onValue(ref(apiFunctions.db, "tasks/" + taskSnapshot.key + '/assignedUsers'), (snapshot2) => {
        snapshot2.forEach(function(userSnapshot) {
          if (userSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersAssignedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
          }
        });
      });
    })

    return usersAssignedTasks;
}

// Returns 2d array with each element as [taskKey, values]
// call using snapshot of all tasks:
//  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
      // getUsersFollowedTasks(userId, snapshot)
//  });
const getUsersFollowedTasks = function getUsersFollowedTasks(userId, snapshot) {
    const usersFollowedTasks = []

    snapshot.forEach(function(taskSnapshot) {
      onValue(ref(apiFunctions.db, "tasks/" + taskSnapshot.key + '/followers'), (snapshot2) => {
        snapshot2.forEach(function(userSnapshot) {
          if (userSnapshot.val().userId == userId) {
            // Keep track of key and values
            usersFollowedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
          }
        });
      });
    })

    return usersFollowedTasks;
}

// Returns T/F
const isTaskOwner = function isTaskOwner(userId, taskId) {
    const isOwner = []

    onValue(ref(apiFunctions.db, "tasks/" + taskId + '/owners'), (snapshot) => {
      snapshot.forEach(function(userSnapshot) {
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
      snapshot.forEach(function(userSnapshot) {
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
      snapshot.forEach(function(userSnapshot) {
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
const updateUser = (id, email, firstName, lastName, profileDescription = "", notificationSetting = "") => {
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
    const auth = getAuth();
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
    const auth = getAuth();
    let result = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // user credential is correct, now signed in
            const user = userCredential.user;
            // TODO: return user information together with the boolean
            return {status: true, msg: "OK"};
        }).catch((error) => {
            // user crednetial not found
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            return {status: false, msg: error.message};
        });
    return result
}

//sign out account
const signOutAccount = () => {
    //once again probably initialize outside
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("signed out successfully");
    }).catch((error) => {
        console.log("wasn't able to sign out :(");
    });
}

//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
    createNewUser,
    createNewGroup,
    createNewProject,
    addProjectOwners,
    addProjectMemebers,
    addTaskAssignedUsers,
    addTaskFollowers,
    addTaskOwners,
    createNewTask,
    getProjectsTasks,
    getUsersProjects,
    getUsersAssignedTasks,
    getUsersFollowedTasks,
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
    db
};

export default apiFunctions;