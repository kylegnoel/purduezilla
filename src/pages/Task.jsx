import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useNavigate } from "react-router-dom";

// material ui imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { AddModerator } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import TaskDashboard from '../components/TaskDashboard';
import EditTask from '../components/EditTask';
import ViewTask from '../components/ViewTask';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';

import '../App.css';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

z
const { id } = useParams();

const theme = createTheme();
const [taskListarr, setTaskListArr] = useState([]);
const [followedTaskListarr, setFollowedTaskList] = useState([]);
const [showFollow, setFollow] = useState(false);

const [name, setName] = useState('');
const [projectList, setProjectList] = useState([]);
const [comments, setComments] = useState([]);
const [newCommentBody, setNewCommentBody] = useState('');
// const [taggingBody, setTaggingBody] = useState('');

const user = apiFunctions.useFirebaseAuth();

const [isEditing, setEditing] = useState(false);
const navigate = useNavigate();

const [completed, setCompleted] = React.useState(false);
const [open, setOpen] = React.useState(false);

const [anchorElNav, setAnchorElNav] = React.useState(null);
const [anchorElUser, setAnchorElUser] = React.useState(null);

const settings = [isEditing ? "View Task" : "Edit Task", 'Delete Task', completed ? "Mark as Complete" : "Mark as In Progress", 'Follow Task'];

const handleClickOpen = () => {
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

const handleDelete = (event) => {
    setOpen(false);
    alert("this functionality has not been implemented yet")

    // to do implement delete
}

const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
};

const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
};

const handleCloseNavMenu = () => {
    setAnchorElNav(null);
};

const handleCloseUserMenu = () => {
    setAnchorElUser(null);
};

const handleCancel = () => {
    setEditing(false)
};

const handleButtonClick = async (setting) => {
    setAnchorElUser(null);
    if (setting === 'Mark as Complete') {
        var selectedTemp = 'Complete'
        setCompleted(!completed)

        let changeTask = await apiFunctions.changeTaskStatus(
            id,
            selectedTemp
        )
        if (changeTask) {
        }
        else {
            if (selectedTemp === "Complete") {
                alert("Task Completed!");
            }
        }
    } else if (setting === 'Mark as In Progress') {
        var selectedTemp = 'In Progress'
        setCompleted(!completed)

        let changeTask = await apiFunctions.changeTaskStatus(
            id,
            selectedTemp
        )
        if (changeTask) {
        }
        else {
            if (selectedTemp === "Complete") {
                alert("Task Completed!");
            }
            else {
                alert("Task Marked As In Progress!");
            }
        }
    } else if (setting === 'View Task') {
        setEditing(false);
    } else if (setting === 'Edit Task') {
        setEditing(true);
    } else if (setting === 'Delete Task') {
        setOpen(true)
    }
}

useEffect(() => {
    // console.log("reload");
    console.log("current user: " + user)
    fetchData();
}, []);


const updateComment = (authorKey, authorName, commentKey, newBody) => {
    apiFunctions.updateTaskComment(commentKey, newBody, authorKey, authorName, id);
    window.location.reload(false);
}
const deleteComment = (commentKey) => {
    apiFunctions.deleteTaskComment(commentKey, id);
    window.location.reload(false);
}

const fetchData = () => {
    // Update the document title using the browser API
    // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
    // // console.log("response: " + response)

    if (id !== undefined) {
        try {
            onValue(ref(apiFunctions.db, 'tasks/' + id), (snapshot) => {
                const val = snapshot.val()

                setName(val.name)
                setNewName(val.name)
                setDesc(val.description)
                setHour(val.estimatedTime)
                setLabel(val.status)
                setOwner(val.owners[1].firstName + " " + val.owners[1].lastName)
                setAssign(val.assignedUsers[1].firstName + " " + val.assignedUsers[1].lastName)
                setProject(val.projectId[1].name)
            })

            //fetch comments as well
            const settingComments = apiFunctions.getTaskComments(id);
            setComments(settingComments);
        }
        catch {
            // if there is no internet
        }

    }
    else {
        setTaskListArr([])
        const taskTemp = apiFunctions.getUsersAssignedTasks(user.key);
        setTaskListArr(taskTemp)

        setFollowedTaskList([])
        const taskFollowedTemp = apiFunctions.getUsersFollowedTasks(user.key);
        setFollowedTaskList(taskFollowedTemp)
    }

    // projects
    try {
        onValue(ref(apiFunctions.db, 'projects/'), (snapshot) => {
            const projectTemp = []
            snapshot.forEach(function (child) {
                const project = child.val()
                projectTemp.push([project, child.key])
            })

            setProjectList(projectTemp)
        })
    }
    catch {
        // if there is no internet
    }

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
        const curTask = (await apiFunctions.getTaskById(id))[0]
        setName(curTask[1].name)

        console.log("loading status: " + curTask[1].status)
        if (curTask[1].status === "Complete") {
            setCompleted(true)
        }
        return true;
    };

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
                <TaskDashboard></TaskDashboard>
            </div>
        );
    }
    else {
        if (isEditing) {
            return (
                <div>
                    <NavBar></NavBar>
                    <ThemeProvider theme={theme}>
                        <Container component="main" maxWidth="sm">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    mt: '20px',
                                }}
                            >
                                <h2>{isEditing ? "Editing: " : "Viewing: "}{name}</h2>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleCancel}
                                    startIcon={<ClearIcon />} >
                                    <b>Cancel</b>
                                </Button>
                            </Box>
                            <br></br>
                            <Divider></Divider>
                        </Container>
                    </ThemeProvider>
                    <EditTask></EditTask>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete '" + name + "'?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                            <Button onClick={handleDelete} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
        else {
            return (
                <div>
                    <NavBar></NavBar>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: '20px',
                        }}
                    >
                        <h2>{isEditing ? "Editing: " : "Viewing: "}{name}</h2>
                    </Box>
                    <ThemeProvider theme={theme}>
                        <Container component="main" maxWidth="sm">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip title="Open settings">
                                    <Button
                                        width='20%'
                                        variant="outlined"
                                        onClick={handleOpenUserMenu}
                                        startIcon={<ExpandMoreIcon />} >
                                        <b>Options</b>
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleButtonClick(setting)}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <br></br>
                            <Divider></Divider>
                        </Container>
                    </ThemeProvider>
                    <ViewTask></ViewTask>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete \'" + name + "\'?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                            <Button onClick={handleDelete} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }

    }

}

export default Task;