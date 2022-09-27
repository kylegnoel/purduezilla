import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, } from "firebase/database";
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

// Write user information to db
// Will create new user if username does not exist, or replaces data
// Does not authenticate user
const writeUserData = function writeUserData(username, email, firstName, lastName, profileDescription, notificationSetting) {
    // TODO: instead of username have uid generated for user
    const userRef = ref(db, 'users/' + username);

    set(userRef, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        profileDescription: profileDescription,
        notificationSetting: notificationSetting,
    });
}

const writeTaskData = function writeTaskData(title, description, estimatedTime, status, permittedUsers, owners, assignedUsers, followers) {
    // TODO: instead of id have uid generated for task
    const userRef = ref(db, 'tasks/');

    set(userRef, {
        title: title,
        description: description,
        estimatedTime: estimatedTime,
        status: status,
        permittedUsers: permittedUsers,
        owners: owners,
        assignedUsers: assignedUsers,
        followers: followers
    });
}


// Create user account with email password authentication
const createAccount = (email, password) => {
    //maybe initialize outside? -PJ
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            // We need to set user in context
            const user = userCredential.user;
            // for now print out user
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //change these later to actually do something meaningfull
            console.log(errorCode);
            console.log(errorMessage);
        });
    /*
    TODO - get user info into database when they create an account - JM

    writeUserData(username, email, firstName, lastName, profileDescription, notificationSetting);
    */
}

const trySignInAccount = async (email, password) => {
    //also maybe initialize outside
    const auth = getAuth();
    let result = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //temperary print
            console.log("success")
            console.log(user);
            // ...
            return true;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // temporary print
            console.log(errorCode);
            console.log(errorMessage);
            return false;
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

/*
// Create new group or update name
function writeGroupData(groupId, name, creatorUserId) {db
    const db = getDatabase(app);
    const groupRef = ref(db, 'groups/' + groupId);
    const ownersListRef = groupRef.child("owners"); // TODO: check if works
    ownersListRef.push(creatorUserId);
}

// Add owner to group; also adds member to group
function addOwnerToGroup(groupId, newOwnerId) {
    const db = getDatabase(app);
    const groupRef = ref(db, 'groups/' + groupId);
    const ownersListRef = groupRef.child("owners"); // TODO: check if works
    ownersListRef.push(newOwnerId);
    addMemberToGroup(groupId, newOwnerId);
}

// Add member to group
function addMemberToGroup(groupId, newMemberId) {
    const db = getDatabase(app);
    const groupRef = ref(db, 'groups/' + groupId);
    const membersListRef = groupRef.child("members"); // TODO: check if works
    membersListRef.push(newOwnerId);
}
*/

// TODO: Remove from group - owner and member
// TODO: Delete group

/*****
 *  
 * Read functions
 *
*****/

// Reads all user information from db and gets/retrieves every time a change is made
// Need a listener that recieves snapshot; can get data in snapshot with val() method
/*
const db = getDatabase(app);
const userRef = ref(db, 'users/' + username);
onValue(userRef, (snapshot) => ) {
    const data = snapshot.val();
    getUserData(userData, data)
}
*/

//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
    writeUserData,
    createAccount,
    trySignInAccount,
    signOutAccount,
};

export default apiFunctions;