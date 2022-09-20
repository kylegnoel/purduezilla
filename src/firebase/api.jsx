import { getDatabase, ref, set, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



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


// Write user information to db
// Will create new user if userID does not exist, or replaces data
function writeUserData(userId, email, firstName, lastName, profileDescription, notificationSetting) {
    // Initialize realtime db with reference to service
    const db = getDatabase(app);
    const reference = ref(db, 'users/' + userId);

    set(ref(db, 'users/' + userId), {
        email: email,
        first_name: firstName,
        last_name: lastName,
        profile_description: profileDescription,
        notification_setting: notificationSetting
    });
}

// Reads all user information from db and gets/retrieves every time a change is made
const db = getDatabase(app);
const user = ref(db, 'users/' + userId + "/retrieve");
onValue(user, (snapshot) => ) {
    const data = snapshot.val();
    getUser(userData, data)
}
