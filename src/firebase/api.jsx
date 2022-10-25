import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
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
    const ownersListRef = ref(db, 'projects/' + newProjectRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add member user Id's
    const memberListRef = ref(db, 'projects/' + newProjectRef.key + '/members');
    for (const i in memberIds) {
        const userRef = push(memberListRef);
        set(userRef, {
            userId: memberIds[i]
        });
    }

    return newProjectRef.key;

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
    const ownersListRef = ref(db, 'tasks/' + newTaskRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add assigned user Id's
    const assignedUserListRef = ref(db, 'tasks/' + newTaskRef.key + '/assignedUsers');
    for (const i in assignedUserIds) {
        const userRef = push(assignedUserListRef);
        set(userRef, {
            userId: assignedUserIds[i]
        });
    }

    // Add follower user Id's
    const followersListRef = ref(db, 'tasks/' + newTaskRef.key + '/followers');
    for (const i in followerIds) {
        const userRef = push(followersListRef);
        set(userRef, {
            userId: followerIds[i]
        });
    }

    return newTaskRef.key;

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

const FirebaseAuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    //const value = { user };

    React.useEffect(() => {
        //const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
            else {
                setUser(null);
            }
        });
    }, []);

    return (
        <FirebaseAuthContext.Provider value={{ user }}>
            {children}
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
    return context.user;
}




//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
    createNewUser,
    createNewGroup,
    createNewProject,
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
    db,
    app,
    FirebaseAuthProvider, useFirebaseAuth,
    auth
};

export default apiFunctions;