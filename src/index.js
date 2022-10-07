import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import apiFunctions from './firebase/api';
import { ref, onValue } from "firebase/database";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
// Test functions for writing to database
apiFunctions.createNewUser("test@purdue.edu", "George", "Washington", "USA!", 1);
apiFunctions.createNewTask("123", "Fix title bug", "The title is showing up twiice", 4, "Planned", ["123", "456"], ["123", "456"], ["123", "456"], ["123", "456"]);
apiFunctions.createNewProject("Create new tracking feature", "This feature will track work", "In progress", ["123", "456"], ["123", "456"]);
apiFunctions.createNewGroup("Lab 268 Group", ["123", "456"], ["123", "456"]);
*/



/*****
 *  
 * Example of how to read from db. Must import the following:
 *       import apiFunctions from './firebase/api';
 *       import { ref, onValue } from "firebase/database";
 * Make sure reference path is correct
 * This function returns the entire user's info
 * 
*****/

// Might have to get new one from db
const userId = "-ND0gmr6QlvyjUcNCDCI";

onValue(ref(apiFunctions.db, 'users/' + userId), (snapshot) => {
    const user = snapshot.val();
    // Do whatever with data here
  });

