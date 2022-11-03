import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Link, CssBaseline, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
import NavBar from '../components/NavBar';
import Avatar from "@mui/material/Avatar";

import { useNavigate, useParams } from "react-router-dom";

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import { FollowTheSignsRounded } from "@mui/icons-material";

const theme = createTheme();


export default function AddTaskPage() {
    const {id} = useParams();

    const [selected, setSelected] = useState([]);
    const [selectedFollower, setSelectedFollower] = useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [assignee, setAssign] = useState('');
    const [hour, setHour] = useState('');
    const [label, setLabel] = useState('');
    const [owner, setOwner] = useState('');
    const [project, setProject] = useState(id);
    const [projectList, setProjectList] = useState([]);
    const [userList, setUserList] = useState([]);

    const [isLoading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
    };

    const handleFollowerChange = (event) => {
        setSelectedFollower(event.target.value);
    };

    const handleNameChange = event => {
        setName(event.target.value)
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };
    
    const handleHourChange = event => {
        setHour(event.target.value)
    };

    const handleLabelChange = event => {
        setLabel(event.target.value)
    };

    const handleOwnerChange = event => {
        setOwner(event.target.value)
    };

    const handleProjectChange = event => {
        setProject(event.target.value)
    };

    const handleAssignChange = event => {
        setAssign(event.target.value)
    };

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("submitted")

        const followerId = ([]);

        selectedFollower.forEach(function(follower) {
            followerId.push(follower[1])
        })
        console.log("followers: " + followerId)

        let createNewTask = await apiFunctions.createNewTask(
            project, // projectId 
            name, // title 
            description, // description
            hour, // estimatedTime
            selected, // status
            owner, // ownerIds
            assignee, // assignedUserIds
            followerId, // followerIds
            )

        if (createNewTask) {
            console.log("task created: ");
            alert("Task Added");
            navigateToPage()
        } else {
            console.log("failed to add task: ");
            alert("Task Failed to Add");
        }
    };

    const fetchData = async(event) => {
        // projects
        try {
            onValue(ref(apiFunctions.db, 'projects/'), (snapshot) => {
                    const projectTemp = []
        
                    snapshot.forEach(function(child) {
                        const project = child.val()
                        console.log("current value: " + project.name + " " + project.projectId)
                        projectTemp.push([project, child.key])
                    })

                    setProjectList(projectTemp)
                    console.log("snapshot: " + projectList.length)
            })
            if (projectList.length !== 0) {
                setLoading(false)
            }
        }
        catch {
            // if there is no internet
        }

        // user
        try {
            onValue(ref(apiFunctions.db, 'users/'), (snapshot) => {
                    const userTemp = []
        
                    snapshot.forEach(function(child) {
                        const user = child.val()
                        console.log("current value: " + user.name + " " + user.projectId)
                        userTemp.push([user, child.key])
                    })

                    setUserList(userTemp)
                    console.log("snapshot: " + userList.length)
            })
            if (userList.length !== 0) {
                setLoading(false)
            }
        }
        catch {
            // if there is no internet
        }
    }

    const navigateToPage = () => {
        navigate('/project/'+ project);
      }

    return(
        <div>
            <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="sm">
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <DialogTitle align='center' 
                        sx={{
                            marginTop:-4,
                            marginBottom:-5,
                        }}>Create New Task</DialogTitle>
                            <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            >                                
                            <Box component="form" sx={{ mt: 4 }}>
                                <Grid container spacing={2}>
                                <Grid item xs={50} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                            autoComplete="given-name"
                                            name="taskName"
                                            onChange={handleNameChange}
                                            required
                                            fullWidth
                                            id="taskName"
                                            label="Task Name"
                                            autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl xs={8} fullWidth>
                                                <InputLabel id="assignLabel">Label</InputLabel>
                                                <Select
                                                    multiple
                                                    defaultValue={10}
                                                    value={selected}
                                                    onChange={selectionChangeHandler}
                                                    label="Label"
                                                    id="label"
                                                    required
                                                    textOverflow="ellipsis"
                                                    overflow="hidden"
                                                    renderValue={(selected) => (
                                                    <div>
                                                        {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                        ))}
                                                    </div>
                                                    )}
                                                >
                                                    <MenuItem value={'To Do'}>To Do</MenuItem>
                                                    <MenuItem value={'In Progress'}>In Progress</MenuItem>
                                                    <MenuItem value={'To Review'}>To Review</MenuItem>
                                                    <MenuItem value={'In Review'}>In Review</MenuItem>
                                                    <MenuItem value={'Complete'}>Complete</MenuItem>
                                                    <MenuItem value={'Saved'}>Saved</MenuItem>
                                                    <MenuItem value={'Closed'}>Closed</MenuItem>
                                                    <MenuItem value={"Won't Do"}>Won't Do</MenuItem>
                                                </Select>
                                                <FormHelperText>Select corresponding labels.</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Input
                                                type="number"
                                                autoComplete="given-name"
                                                name="estimatedHours"
                                                required
                                                fullWidth
                                                onChange={handleHourChange}
                                                id="estimatedHours"
                                                label="Estimated Hours"
                                                value={hour}
                                                autoFocus
                                                />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="projectLabel">Project</InputLabel>
                                        <Select
                                            labelId="projectLabel"
                                            id="projectLabel"
                                            label="Project"
                                            defaultValue={id}
                                            onChange={handleProjectChange}
                                        >
                                            { projectList && projectList.length != 0 ? projectList.map((data) => 
                                                <MenuItem value={data[1]}>{data[0].name}</MenuItem>
                                            ): <MenuItem value={0}>New Project</MenuItem> }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    required
                                    fullWidth
                                    multiline
                                    onChange={handleDescChange}
                                    rows={4}
                                    id="taskDescription"
                                    label="Task Description"
                                    name="taskDescription"
                                    />
                                </Grid>
                                </Grid>

                                <br></br>
                                <Divider>OWNERSHIP</Divider>
                                <br></br>

                                <FormControl fullWidth>
                                    <InputLabel id="ownerLabel">Owner</InputLabel>
                                    <Select
                                        labelId="ownerLabelSelect"
                                        id="ownerSelect"
                                        label="ownerLabel"
                                        onChange={handleOwnerChange}
                                        defaultValue={10}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                            <MenuItem value={data[1]}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                        ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the team member who oversees this task.</FormHelperText>
                                </FormControl>

                                <br></br>
                                <br></br>
                                <Divider>ASSIGN</Divider>
                                <br></br>
                                <FormControl fullWidth>
                                    <InputLabel id="assignLabel">Assignee</InputLabel>
                                    <Select
                                        labelId="assignLabelSelect"
                                        id="assignSelect"
                                        label="assignLabel"
                                        onChange={handleAssignChange}
                                        defaultValue={10}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                                <MenuItem value={data[1]}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                            ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the team member who is assigned to this task.</FormHelperText>
                                </FormControl>

                                <br></br>
                                <br></br>
                                <Divider>FOLLOWERS</Divider>
                                <br></br>

                                <FormControl xs={12} fullWidth>
                                    <InputLabel id="followerLabel">Follower</InputLabel>
                                    <Select
                                        multiple
                                        defaultValue={10}
                                        value={selectedFollower}
                                        onChange={handleFollowerChange}
                                        label="followerLabel"
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        id="followerSelect"
                                        renderValue={(selectedFollower) => (
                                        <div>
                                            {selectedFollower.map((data) => (
                                             <Chip 
                                             key={data[1]} 
                                             avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                             label={data[0].firstName + " " + data[0].lastName} 
                                             sx={{marginRight:1,}}/>
                                            ))}
                                        </div>
                                        )}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                                <MenuItem value={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                            ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the team members to follow this task..</FormHelperText>
                                </FormControl>
                            </Box>
                            </Box>
                            <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    >
                                Create Task
                                </Button>
                        </Box>
                    </Container>
            </ThemeProvider>
        </div>
        
    );
}