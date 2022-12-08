import * as React from 'react';

// material ui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import TaskIcon from '@mui/icons-material/Task';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function TaskDashboard() {
    const [taskListarr, setTaskListArr] = useState([]);
    const [followedTaskListarr, setFollowedTaskList] = useState([]);
    const [name, setName] = useState('');
    const [newName, setNewName] = useState('');
    const [description, setDesc] = useState('');
    const [assignee, setAssign] = useState('');
    const [hour, setHour] = useState('');
    const [label, setLabel] = useState('');
    const [owner, setOwner] = useState('');
    const [project, setProject] = useState('');
    const [newProject, setNewProject] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [showFollow, setFollow] = useState(false);

    const [selectedFollower, setSelectedFollower] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const user = apiFunctions.useFirebaseAuth();

    const handleShowFollow = (event) => {
        setFollow(!showFollow)
    }

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            window.location.href = '/task/' + event.currentTarget.id
        }
        else {
            window.location.href = '/newtask/'
        }
    }


    const fetchData = async (event) => {
        console.log("user: " + JSON.stringify(user))
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // // console.log("response: " + response)

        setTaskListArr([])
        const taskTemp = apiFunctions.getUsersAssignedTasks(user.key);
        setTaskListArr(taskTemp)
        console.log("taskTemp: " + taskTemp)

        setFollowedTaskList([])
        const taskFollowedTemp = apiFunctions.getUsersFollowedTasks(user.key);
        console.log("followedTaskTemp " + taskFollowedTemp)
        setFollowedTaskList(taskFollowedTemp)

        setProjectList(await apiFunctions.getTaskById(""))

        // user
        try {
            onValue(ref(apiFunctions.db, 'users/'), (snapshot) => {
                const userTemp = []
                snapshot.forEach(function (child) {
                    const user = child.val()
                    userTemp.push([user, child.key])
                })

                setUserList(userTemp)
            })
        }
        catch {
            // if there is no internet
        }
        return true;
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <br></br>
                    {showFollow
                        ? <h2>Assigned Tasks</h2>
                        : <h2>Followed Tasks</h2>
                    }
                    <Divider></Divider>
                    <br></br>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '40%',
                            mb: '-100px',
                            ml: '30%'
                        }}>
                        {showFollow
                            ? <div>
                                <Button
                                    onClick={handleShowFollow}
                                    variant="outlined"
                                    startIcon={<BookmarkIcon />}
                                    sx={{ mb: 8 }}
                                >
                                    <b>Show Tasks I Follow</b>
                                </Button>
                            </div>
                            :
                            <div>
                                <Button
                                    onClick={handleShowFollow}
                                    variant="outlined"
                                    startIcon={<BookmarkIcon />}
                                    sx={{ mb: 8 }}>
                                    <b>Show Tasks I Am Assigned</b>
                                </Button>
                            </div>
                        }
                        <br></br>
                    </Box>
                    <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                {showFollow
                                    ? <FixedSizeList sx={{
                                        border: 1, borderColor: 'black', maxHeight: 600, overflowY: 'auto', flexGrow: 1,
                                        flexDirection: "column",
                                    }} height={400}>
                                        {taskListarr && taskListarr.length != 0 ? taskListarr.map((data) => {
                                            return (
                                                <div key={data.projectId}>
                                                    <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%' }}>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <TaskIcon color="grey" />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={data[1].name} secondary={data[1].description} />
                                                        </ListItem>
                                                    </Button>
                                                    <Divider />
                                                </div>
                                            )
                                        }) : "There are no tasks!"}
                                        <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%' }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey" />
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Task"} />
                                            </ListItem>
                                        </Button>
                                    </FixedSizeList>
                                    : <FixedSizeList sx={{
                                        border: 1, borderColor: 'black', maxHeight: 600, overflowY: 'auto', flexGrow: 1,
                                        flexDirection: "column",
                                    }} height={400}>
                                        {followedTaskListarr && followedTaskListarr.length != 0 ? followedTaskListarr.map((data) => {
                                            return (
                                                <div key={data.projectId}>
                                                    <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%' }}>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <TaskIcon color="grey" />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={data[1].name} secondary={data[1].description} />
                                                        </ListItem>
                                                    </Button>
                                                    <Divider />
                                                </div>
                                            )
                                        }) : "There are no tasks!"}
                                        <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%' }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey" />
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Task"} />
                                            </ListItem>
                                        </Button>
                                    </FixedSizeList>}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}