import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import apiFunctions from './firebase/api';

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
// Test functions for database
apiFunctions.createNewUser("test@purdue.edu", "First", "Last", "USA!", 1);
apiFunctions.createNewTask("123", "TitleTest0", "This is the first task.", 4, "Planned", ["123", "456"], ["123", "456"], ["123", "456"], ["123", "456"]);
apiFunctions.createNewProject("newProject", "first project!", "In progress", ["123", "456"], ["123", "456"]);
apiFunctions.createNewGroup("Mygroup", ["123", "456"], ["123", "456"]);
*/