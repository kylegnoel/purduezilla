import React, { useState, useEffect } from 'react';
import {Route, Link, Routes, useParams} from 'react-router-dom'; 

import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import LoadTasks from '../components/LoadTasks';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import { useNavigate } from "react-router-dom";

import '../App.css';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const Task = () => {
    const {id} = useParams();
    console.log("parameters: " + id);

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [assignee, setAssign] = useState('');
    const [hour, setHour] = useState('');
    const [label, setLabel] = useState('');
    const [owner, setOwner] = useState('');
    const [project, setProject] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {
        console.log("fetched hello: ")
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        try {
            onValue(ref(apiFunctions.db, 'tasks/' + id), (snapshot) => {
                console.log("RESULT: " + snapshot.val().name)
                    const val = snapshot.val()

                    setName(val.name)
                    setDesc(val.description)
                    setHour(val.estimatedTime)
                    setLabel(val.status)

                    //owner
                    if (val.owner !== "") {
                        onValue(ref(apiFunctions.db, "users/" + val.owner), (snapshot) => {
                            setOwner(snapshot.val().firstName + " " + snapshot.val().lastName)
                        });
                    }

                    //assignee
                    if (val.assignedUsers !== "") {
                        onValue(ref(apiFunctions.db, "users/" + val.assignedUsers), (snapshot) => {
                            setAssign(snapshot.val().firstName + " " + snapshot.val().lastName)
                        });
                    }
                    
                    
                    // set project name
                    onValue(ref(apiFunctions.db, "projects/" + val.projectId), (snapshot1) => {
                        setProject(snapshot1.val().name)
                    });

                    setUserList(val.description)

                    console.log(name)

            })
            if (taskListarr.length !== 0) {
                setLoading(false)
            }
        }
        catch {
            // if there is no internet
        }

        setLoading(false)
        console.log("taskListarr: " + taskListarr.length)
        return true;
    };

    return (
        <div> 
            <NavBar></NavBar>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <Box component="form" Validate sx={{ mt: 3 }}>        
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >
                            <Box sx={{ mt: 6 }}>
                                <Grid container spacing={2}>
                                <Grid item xs={50} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                            autoComplete="given-name"
                                            name="taskName"
                                            fullWidth
                                            id="taskName"
                                            value={name}
                                            disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                            autoComplete="given-name"
                                            name="label"
                                            fullWidth
                                            id="label"
                                            value={label}
                                            disabled
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                                autoComplete="given-name"
                                                name="project"
                                                fullWidth
                                                id="project"
                                                value={project}
                                                disabled
                                                />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    required
                                    fullWidth
                                    multiline
                                    disabled
                                        rows={4}
                                    id="taskDescription"
                                    name="taskDescription"
                                    value={description}
                                    />
                                </Grid>
                                </Grid>

                                <br></br>
                                <Divider>OWNERSHIP</Divider>
                                <br></br>

                                <TextField
                                    autoComplete="given-name"
                                    name="owner"
                                    fullWidth
                                    id="owner"
                                    value={owner}
                                    disabled
                                    />

                                <br></br>
                                <br></br>
                                <Divider>ASSIGN</Divider>
                                <br></br>
                                <TextField
                                    autoComplete="given-name"
                                    name="assign"
                                    fullWidth
                                    id="assign"
                                    value={assignee}
                                    disabled
                                />
                            </Box>
                        </Box>
                    </Box>
                    <br></br>
                    <Divider rightAlign>Comment</Divider>
                    <Box component="form" Validate sx={{ mt: 3 }}>        
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >
                            <h2>Comment</h2>
                            <Grid container spacing={2}>
                                <Grid item xs={50} sm={12} sx={{ mt: 6 }}>
                                    <Grid container spacing={2}></Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                            required
                                            fullWidth
                                            multiline
                                                rows={4}
                                            id="commentbox"
                                            name="commentbox"
                                            value={description}
                                            />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            {/* <LoadTasks></LoadTasks> */}
            </div>
    );
}

export default Task;