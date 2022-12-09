import React, { useState, useEffect } from 'react';
import { Route, Link, Routes, useParams } from 'react-router-dom';

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
import TaskDashboard from '../components/TaskDashboard';

export default function EditTask() {
    const { id } = useParams();

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [followedTaskListarr, setFollowedTaskList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showFollow, setFollow] = useState(false);

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
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState('');
    // const [taggingBody, setTaggingBody] = useState('');

    const user = apiFunctions.useFirebaseAuth();

    const [isEditing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [assign, setAssigned] = useState(false);
    
    const [selectedFollower, setSelectedFollower] = useState([]);
    const [completed, setCompleted] = React.useState(false);

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
    };

    const handleFollowerChange = (event) => {
        setSelectedFollower(event.target.value);
    };

    const handleNameChange = event => {
        setNewName(event.target.value)
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
        setNewProject(event.target.value)
    };

    const handleAssignChange = event => {
        setAssign(event.target.value)
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            window.location.href='/task/'+event.currentTarget.id
        }
        else {
            window.location.href='/newtask/'
        }
    }

    const handleEditing = (event) => {
        setEditing(false)
    }

    const handleClick = (event) => {
        if (event.detail === 2) {
            setEditing(!isEditing)
        }
    }

    const assignToMe = async (event) => {

        const userTemp = apiFunctions.getObjectById("users", user.key)
        let addTaskAssignedUsers = await apiFunctions.addTaskAssignedUsers(
            id,
            userTemp[0][0]
        )
        setAssign(userTemp[0][1].firstName + " " + userTemp[0][1].lastName)
        setAssigned(true)
        if (addTaskAssignedUsers) {
            alert("Assigned to Me!");
        } else {
            alert("Task Failed to Save");
        }
    }
    
    const handleShowFollow = (event) => {
        setFollow(!showFollow)
    }

    const handleMarkDone = async (event) => {
        const selectedTemp = ''
        if (completed) {
            setLabel('Complete');
            setCompleted(false)
            alert('Task Completed!')
            selectedTemp = 'Complete'
        }
        else {
            setLabel('In Progress');
            setCompleted(true)
            alert('Task Changed!')
            selectedTemp = 'In Progress'
        }

        const userTemp = (await apiFunctions.getObjectById("users", user.key)[0])

        let updateTaskDetails = await apiFunctions.updateTaskDetails(
            id,
            newName, // title 
            description, // description
            hour, //estimated time
            selectedTemp, // status
            user.key,
            userTemp[1].firstName + " " + userTemp[1].lastName
            )

        setLabel(selectedTemp)
        
            if (updateTaskDetails) {
                //window.location.href='/task/'+id
                
            } else {
                alert("Task Failed to Save");
            }
    }


    const handleSubmit = async (event) => {
        //event.preventDefault()

        const userTemp = (await apiFunctions.getObjectById("users", user.key))[0]
        console.log(userTemp + " " + user.key)
        
        let updateTaskDetails = await apiFunctions.updateTaskDetails(
            id,
            newName,
            description,
            hour,
            label, // description
            user.key, // status
            userTemp[1].firstName + " " + userTemp[1].lastName
        )

        if (updateTaskDetails) {
            alert("Task Saved! " + newName);
            window.location.href = '/task/' + id

        } else {
            alert("Task Failed to Save");
        }
    };

    useEffect(() => {
        // console.log("reload");
        console.log("current user: " + user)
        fetchData();
    }, []);

    const newCommentSubmit = (event) => {
        event.preventDefault();

        if (newCommentBody == '') {
            return;
        }
        let tagged = [];
        let splitComment = newCommentBody.split(" ");
        splitComment.forEach((word) => {
            if (word.charAt(0) == '#') {
                tagged.push(word.substring(1));
            }
        });

        let newAdded = apiFunctions.createNewComment(newCommentBody, user.key, id, tagged);
        // window.location.reload();

        setNewCommentBody("");
        setComments([...comments, newAdded]);
    };

    const fetchData = async (event) => {
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // // console.log("response: " + response)

        if (id !== undefined) {
            try {
                const curTask = (await apiFunctions.getTaskById(id))[0]
                console.log("values: " + JSON.stringify(curTask))
                setName(curTask[1].name)
                setNewName(curTask[1].name)
                setDesc(curTask[1].description)
                setHour(curTask[1].estimatedTime)
                setLabel(curTask[1].status)
                setSelectedFollower(curTask[1].followers)

                const curProject = (await apiFunctions.getObjectById("projects", curTask[1].projectId))[0]
                console.log(JSON.stringify(curProject))
                setProject(curProject[1].name)

                // set owner field
                const ownerTemp = (await apiFunctions.getObjectById("users",curTask[1].ownerId))[0]
                setOwner(ownerTemp[1].firstName + " " + ownerTemp[1].lastName)

                // set assignee field
                const assignTemp = (await apiFunctions.getObjectById("users",curTask[1].assignedUserId))[0]
                setAssign(assignTemp[1].firstName + " " + assignTemp[1].lastName)
                // set assignee field


                //fetch comments as well
                const settingComments = apiFunctions.getTaskComments(id);
                setComments(settingComments);
            }
            catch {
                // if there is no internet
            }    

        }
    
        // projects
        const projectTemp = await apiFunctions.getObjectById("projects", "")
        console.log("projectTemp: " + JSON.stringify(projectTemp))
        setProjectList(projectTemp)

        // users
        const userTemp = await apiFunctions.getObjectById("users", "")
        setUserList(userTemp)

        setLoading(false)
        return true;
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="sm">
                    <Box component="form" Validate sx={{ mt: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'right',
                                width: '20%',
                                mr: '-60px',
                                ml: '50.0rem',
                            }}>
                            <br></br>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={50} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    autoComplete="given-name"
                                                    name="taskName"
                                                    fullWidth
                                                    id="taskName"
                                                    onChange={handleNameChange}
                                                    value={newName}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <FormControl xs={8} fullWidth>
                                                    <InputLabel id="assignLabel">{label}</InputLabel>
                                                    <Select
                                                        defaultValue={10}
                                                        value={selected}
                                                        onChange={selectionChangeHandler}
                                                        label="Status"
                                                        id="label"
                                                        required
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
                                                    <FormHelperText>Previous values: {label}</FormHelperText>
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
                                            <InputLabel id="projectLabel">{project}</InputLabel>
                                            <Select
                                                defaultValue={10}
                                                onChange={handleProjectChange}
                                                label={"Project"}
                                                id="label"
                                                textOverflow="ellipsis"
                                                overflow="hidden"
                                            >
                                                {projectList && projectList.length != 0 ? projectList.map((data) =>
                                                    <MenuItem value={data[0]}>{data[1].name}</MenuItem>
                                                ) : <MenuItem value={0}>New Project</MenuItem>}
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
                                            value={description}
                                        />
                                    </Grid>
                                </Grid>
                                <br></br>
                                <Divider>OWNERSHIP</Divider>
                                <br></br>
                                <FormControl fullWidth>
                                    <InputLabel id="ownerLabel">{owner}</InputLabel>
                                    <Select
                                        labelId="ownerLabelSelect"
                                        id="ownerSelect"
                                        label="ownerLabel"
                                        onChange={handleOwnerChange}
                                        defaultValue={owner}
                                        value={owner}
                                    >
                                        {userList && userList.length != 0 ? userList.map((data) =>
                                            <MenuItem value={data[0]}>{data[1].firstName + " " + data[1].lastName}</MenuItem>
                                        ) : <MenuItem value={0}>New User</MenuItem>}
                                    </Select>
                                </FormControl>

                                <br></br>
                                <br></br>
                                <Divider>ASSIGN</Divider>
                                <br></br>
                                <FormControl fullWidth>
                                    <InputLabel id="assignLabel">{assignee}</InputLabel>
                                    <Select
                                        labelId="assignLabelSelect"
                                        id="assignSelect"
                                        label="assignLabel"
                                        onChange={handleAssignChange}
                                        value={assignee}
                                        defaultValue={assignee}
                                    >
                                        {userList && userList.length != 0 ? userList.map((data) =>
                                            <MenuItem value={data[0]}>{data[1].firstName + " " + data[1].lastName}</MenuItem>
                                        ) : <MenuItem value={0}>New User</MenuItem>}
                                    </Select>
                                </FormControl>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <br></br>
                    <Divider rightAlign><h2>Comment</h2></Divider>
                    <Box component="form" Validate sx={{ mt: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {comments.map((comment) => (
                                < div >
                                    <p> author key: {comment.author}</p>
                                    <p>body: {comment.body}</p>
                                </div>
                            ))}


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
                                            value={newCommentBody}
                                            onChange={(e) => setNewCommentBody(e.target.value)}
                                        />
                                        <br></br>
                                        <Button
                                            variant="contained"
                                            onClick={newCommentSubmit}> new Comment </Button>
                                        <br></br>
                                        <br></br>
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