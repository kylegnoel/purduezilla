import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import NewProjectDialog from '../components/NewProject'
import { Typography } from '@mui/material';
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