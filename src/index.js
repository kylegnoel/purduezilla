import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import apiFunctions from './firebase/api';
import { ref, onValue, on } from "firebase/database";
import { orderByChild } from 'firebase/functions';

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


console.log(apiFunctions.addProjectOwners("-NEqhri7RaC8Sg8jtYCD", ["3321","542332", "32132"]))
