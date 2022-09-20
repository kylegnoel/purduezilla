import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


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


/*****
 *  
 * Write functions
 *
*****/

// Write user information to db
// Will create new user if userID does not exist, or replaces data
function writeUserData(userId, email, firstName, lastName, profileDescription, notificationSetting) {
    const db = getDatabase(app);
    const userRef = ref(db, 'users/' + userId);

    set(userRef, {
        email: email,
        first_name: firstName,
        last_name: lastName,
        profile_description: profileDescription,
        notification_setting: notificationSetting
    });
}

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

// TODO: Remove from group - owner and member

/*****
 *  
 * Read functions
 *
*****/

// Reads all user information from db and gets/retrieves every time a change is made
// Need a listener that recieves snapshot; can get data in snapshot with val() method
const db = getDatabase(app);
const userRef = ref(db, 'users/' + userId);
onValue(userRef, (snapshot) => ) {
    const data = snapshot.val();
    getUserData(userData, data)
}
