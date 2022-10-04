import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import LoadTasks from '../components/LoadTasks';

const Projects = () => {

    return (
        <div> 
            <NavBar></NavBar>
            <AddTask></AddTask>
            <LoadTasks></LoadTasks>
            </div>
    );
}

export default Projects;