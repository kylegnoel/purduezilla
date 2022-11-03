import React, { useState, useEffect } from 'react';
import {Route, Link, Routes, useParams} from 'react-router-dom'; 

import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import LoadTasks from '../components/LoadTasks';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import ProjectDashboard from '../components/ProjectDashboard';
import { useNavigate } from "react-router-dom";

const Storyboard = () => {

    return (
        <div> 
            <NavBar></NavBar>
        </div>
    );
}



export default Storyboard;