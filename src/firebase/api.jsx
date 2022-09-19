// import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase } from "firiebase/database";
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

const fireapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(fireapp);

//const db = getFirestore(fireapp);
const database = getDatabase(app);

//export functions here