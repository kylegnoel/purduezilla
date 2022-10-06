import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import LoadTasks from '../components/LoadTasks';


const Dashboard = () => {

    return (
        <div> 
            <NavBar></NavBar>
            <AddTask></AddTask>
            <LoadTasks></LoadTasks>
            Dashboard Page
        </div>
    );
}

export default Dashboard;