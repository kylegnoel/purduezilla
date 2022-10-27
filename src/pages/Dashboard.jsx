import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import LoadTasks from '../components/LoadTasks';
import ViewTasks from '../components/TaskDashboard';
import Activity from '../components/Activity';
import Projects from '../components/ProjectDashboard'
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import '../App.css'


const Dashboard = () => {

    return (
        <div>
            <NavBar></NavBar>
            <div class="flex-container">
                <div style={{marginBottom: '-16px'}}class="flex-child">
                <Typography
                variant="h5"
                maxWidth={'9em'}
                marginBottom='-16px'
                marginLeft='24px'
                marginTop='24px'
                noWrap
                href=""
                sx={{
                mr: 2,
                textAlign: 'center',
                display: { xs: 'flex'},
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                }}
                >
            Tasks
          </Typography>
                </div>
                <div style={{marginBottom: '-16px'}}class="flex-child">
                <Typography
                variant="h5"
                maxWidth={'9em'}
                marginBottom='-16px'
                marginLeft='24px'
                marginTop='24px'
                noWrap
                href=""
                sx={{
                mr: 2,
                textAlign: 'center',
                display: { xs: 'flex'},
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                }}
                >
            Projects
          </Typography>
                </div>
            </div>
            

            <div class="flex-container">
                <div class="flex-child">
                    <ViewTasks></ViewTasks>
                </div>
                <div class="flex-child"> 
                    <Projects></Projects>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;