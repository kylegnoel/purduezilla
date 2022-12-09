import React, { useState, useEffect } from 'react';
import { Route, Link, Routes, useParams } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

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

import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';


import '../App.css';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";


export default function ViewTask() {
    const { id } = useParams();

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [followedTaskListarr, setFollowedTaskList] = useState([]);
    const [assignedToMe, setAssignedToMe] = useState(false);
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

    const [followers, setFollowers] = useState([]);
    // const [taggingBody, setTaggingBody] = useState('');

    const user = apiFunctions.useFirebaseAuth();

    const [isEditing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    
    const [selectedFollower, setSelectedFollower] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const [expanded, setExpanded] = React.useState(false);

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
        if (event.target.value === 'Complete') {
            alert('Task Completed!');
        }
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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

    const showUser = (event) => {
        console.log(event.currentTarget.id)
        navigate('/profile/' + event.currentTarget.id);
    }

    const handleProjectChange = event => {
        setNewProject(event.target.value)
    };

    const handleAssignChange = event => {
        setAssign(event.target.value)
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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

    const handleDelete = (event) => {

    }

    const handleClick = (event) => {
        if (event.detail === 2) {
            setEditing(!isEditing)
        }
    }

    const assignToMe = async (event) => {
        if (!assignedToMe) {
            const curUser = (await apiFunctions.getObjectById("users",user.key))[0]
            console.log("assigningTask: " + id + " " + user.key)
            let addTaskAssignedUsers = await apiFunctions.changeTaskAssignedUser(
                id,
                user.key
            )
            console.log("current user key: " + user.key + " ")
            setAssign(curUser[1].firstName + " " + curUser[1].lastName)
            setAssignedToMe(true)
            if (addTaskAssignedUsers) {
                alert("Assigned to Me!");
            } 
        } else {
            // assigned to me, remove designation
            let addTaskAssignedUsers = await apiFunctions.changeTaskAssignedUser(
                id,
                "undefined"
            )
            console.log("current user key: " + user.key + " ")
            setAssign("Task Not Assigned To Anyone")
            setAssignedToMe(false)
            if (addTaskAssignedUsers) {
                alert("Task Assignee Removed!");
            }
        }
        
    }
    
    const handleShowFollow = (event) => {
        setFollow(!showFollow)
    }

    const handleMarkDone = async (event) => {
        var selectedTemp = ''
        if (completed) {
            setLabel('Complete');
            setCompleted(false)
            selectedTemp = 'Complete'
        }
        else {
            setLabel('In Progress');
            setCompleted(true)
            selectedTemp = 'In Progress'
        }

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
    }


    const handleSubmit = async (event) => {
        //event.preventDefault()
        
        let updateTaskDetails = await apiFunctions.updateTaskDetails(
            id,
            newProject, // projectId 
            newName, // title 
            description, // description
            hour, //estimated time
            selected, // status
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
                console.log("recieved Task: " + JSON.stringify(curTask))
                setName(curTask[1].name)
                setNewName(curTask[1].name)
                setDesc(curTask[1].description)
                setHour(curTask[1].estimatedTime)
                setLabel(curTask[1].status)
                
                // set parent project name
                const parentProject = (await apiFunctions.getObjectById("projects",curTask[1].projectId))[0]
                console.log("parentProject: " + JSON.stringify(parentProject))
                setProject(parentProject[1].name)
                // set owner field
                const ownerTemp = (await apiFunctions.getObjectById("users",curTask[1].ownerId))[0]
                setOwner(ownerTemp[1].firstName + " " + ownerTemp[1].lastName)
                // set assignee field

                if (curTask[1].assignedUserId === user.key) {
                    console.log("currently assigned to me")
                    const assignee = (await apiFunctions.getObjectById("users",curTask[1].assignedUserId))[0]
                    setAssign(assignee[1].firstName + " " + assignee[1].lastName)
                    setAssignedToMe(true);
                }
                else if (curTask[1].assignedUserId === "undefined") {
                    setAssign("Task Not Assigned To Anyone")
                }
                else {
                    const assignee = (await apiFunctions.getObjectById("users",curTask[1].assignedUserId))[0]
                    setAssign(assignee[1].firstName + " " + assignee[1].lastName)
                }
    
                //fetch comments as well
                const settingComments = apiFunctions.getTaskComments(id);
                setComments(settingComments);
            }
            catch {
                // if there is no internet
            }    


            const taskFollowers = (await apiFunctions.getTaskFollowers(id))
            setFollowers(taskFollowers)
            console.log("followers: " + taskFollowers)
        }
        
        // projects
        const projectTemp = await apiFunctions.getObjectById("projects","")
        setProjectList(projectTemp)

        // users
        const userTemp = await apiFunctions.getObjectById("users","")
        setUserList(userTemp)

        return true;
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="60%">
                    <Box component="form" Validate sx={{ mt: 3 }}>      
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={50} sm={6}>
                                        <Grid item sm={12}>
                                            <Divider sx={{ mt: 0, mb:2 }}>TASK DETAILS</Divider>
                                            <Grid container spacing={1}>
                                                <Grid item sm={8}>
                                                    <TextField
                                                        autoComplete="given-name"
                                                        name="label"
                                                        fullWidth
                                                        id="label"
                                                        value={label}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item sm={4}>
                                                    <TextField
                                                        autoComplete="given-name"
                                                        name="label"
                                                        fullWidth
                                                        id="label"
                                                        value={hour + " hours"}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                        <Divider sx={{ mt: 2, mb:2 }}>PROJECT</Divider>
                                        <Grid item sm={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                autoComplete="given-name"
                                                name="project"
                                                fullWidth
                                                id="project"
                                                value={project}
                                                InputProps={{
                                                    readOnly: true,
                                                    }}
                                            />
                                        </FormControl>
                                        <Divider sx={{ mt: 2, mb:2 }}>DESCRIPTION</Divider>
                                            <TextField
                                                required
                                                fullWidth
                                                multiline
                                                InputProps={{
                                                    readOnly: true,
                                                  }}
                                                rows={4}
                                                id="taskDescription"
                                                name="taskDescription"
                                                value={description}
                                            />
                                        <br></br>
                                        <br></br>
                                        </Grid>
                                    </Grid>
                                    
                                    <Grid item xs={50} sm={6}>
                                        <Divider>OWNERSHIP</Divider>
                                        <Accordion 
                                        sx={{ mt: '10px' }} 
                                        fullWidth 
                                        expanded={expanded === 'panel1'} 
                                        onChange={handleChange('panel1')}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            >
                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                            Task Owner
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            Members who created/own the task.
                                        </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>  
                                        <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt={owner} src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                    <ListItemText
                                                    primary={<Link fullWidth>{owner}</Link>}
                                                    secondary={
                                                        <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            Owner
                                                        </Typography>
                                                        </React.Fragment>
                                                    }
                                                    />
                                                    
                                            </ListItem>
                                        </List>
                                        </AccordionDetails>
                                    </Accordion>
                                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2bh-content"
                                            id="panel2bh-header"
                                            >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Assignee</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Person assigned to this task.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Divider></Divider>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8}>
                                                        <TextField
                                                            autoComplete="given-name"
                                                            name="assign"
                                                            fullWidth
                                                            id="assign"
                                                            value={assignee}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Button
                                                            onClick={assignToMe}
                                                            variant="outlined"
                                                            fullWidth
                                                            startIcon={assignedToMe ? <ClearIcon/> : <CheckIcon />}
                                                            sx={{ mt: 1, mb: 2, height: '55px' }}
                                                            >
                                                        <b>{assignedToMe ? 'Unassign Me' : 'Assign to Me'}</b> 
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel3bh-content"
                                            id="panel3bh-header"
                                            >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Followers
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Users who follow this task.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            { followers && followers.length !== 0 && followers !== {} ? followers.map((data) => {
                                                return(
                                                    <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={data[1].firstName + " " + data[1].lastName} src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                    primary={<Link onClick={showUser} id={data[0]} fullWidth>{data[1].firstName + " " + data[1].lastName}</Link>}
                                                    secondary={
                                                        <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            Viewer
                                                        </Typography>
                                                        </React.Fragment>
                                                    }
                                                    />
                                                    </ListItem>
                                                );
                                            }): "There are no viewers in this group!" }
                                            </AccordionDetails>
                                        </Accordion>
                                        </Grid>
                                </Grid>
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
                                            InputProps={{
                                                readOnly: true,
                                            }}
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
                                        <button onClick={newCommentSubmit}> new Comment </button>
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