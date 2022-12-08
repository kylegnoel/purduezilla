import React from 'react';

// components import
import NavBar from '../components/NavBar';
import NewProjectDialog from '../components/NewProject'

import '../App.css'

const NewProject = () => {
    return (
        <div>
            <NavBar></NavBar>
            <NewProjectDialog></NewProjectDialog>
        </div>
        
    );  
}

export default NewProject;