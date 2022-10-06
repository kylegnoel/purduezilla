import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import LoadTasks from '../components/LoadTasks';
import ViewTasks from '../components/ViewTasks';
import Activity from '../components/Activity';
import Projects from '../components/ViewProjects'
import '../App.css'


const Dashboard = () => {

    return (
        <div>
            <NavBar></NavBar>
            <div class="flex-container">
                <div class="flex-child"> 
                    <ViewTasks></ViewTasks>
                </div>
                <div class="flex-child"> 
                    <Projects></Projects>
                </div>
            </div>
            <Activity></Activity>
        </div>
    );
}

export default Dashboard;