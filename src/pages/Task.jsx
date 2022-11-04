import React, { useState, useEffect } from 'react';
import { Route, Link, Routes, useParams } from 'react-router-dom';

import NavBar from '../components/NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import TaskIcon from '@mui/icons-material/Task';
import FixedSizeList from '@mui/material/List';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckIcon from '@mui/icons-material/Check';

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

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import '../App.css';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const Task = () => {
    const { id } = useParams();
    console.log("parameters: " + id);

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
    console.log(JSON.stringify(user))

    const [isEditing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [assign, setAssigned] = useState(false);
    
    const [selectedFollower, setSelectedFollower] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
        console.log("selection: " + event.target.value)
        if (event.target.value === 'Complete') {
            console.log("COMPLETED")
            alert('Task Completed!');
        }
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

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            console.log("eventid: " + event.currentTarget.id)
            //navigate('/task/'+event.currentTarget.id);
            window.location.href='/task/'+event.currentTarget.id
        }
        else {
            // navigate('/newtask');
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
            console.log('double click');
            setEditing(!isEditing)
          }
    }

    const assignToMe = async (event) => {

        const userTemp = apiFunctions.getUserById(user.key)
        console.log(userTemp)
        console.log("saving: " + JSON.stringify(userTemp[0][1]))
        let addTaskAssignedUsers = await apiFunctions.addTaskAssignedUsers(
            id,
            userTemp[0][0]
        )
        setAssign(userTemp[0][1].firstName + " " + userTemp[0][1].lastName)
        setAssigned(true)
        if (addTaskAssignedUsers) {
            alert("Assigned to Me!");
        } else {
            console.log("failed to save task: ");
            alert("Task Failed to Save");
        }
    }
    
    const handleShowFollow = (event) => {
        setFollow(!showFollow)
        console.log("value of showFollow: " + showFollow)
    }

    const handleMarkDone = async (event) => {
        const selectedTemp = ''
        if (completed) {
            setSelected('Complete');
            setCompleted(false)
            alert('Task Completed!')
            selectedTemp = 'Complete'
        }
        else {
            setSelected('In Progress');
            setCompleted(true)
            alert('Task Changed!')
            selectedTemp = 'In Progress'
        }


        let updateTaskDetails = await apiFunctions.updateTaskDetails(
            id,
            project, // projectId 
            newName, // title 
            description, // description
            hour, //estimated time
            selectedTemp, // status
            )

        setLabel(selectedTemp)
        console.log("selected: " + selectedTemp)
        
            if (updateTaskDetails) {
                //window.location.href='/task/'+id
                
            } else {
                console.log("failed to save task: ");
                alert("Task Failed to Save");
            }
    }


    const handleSubmit = async (event) => {
        //event.preventDefault()
        console.log("DONE SUBMITTED: " + id + " " + newName + " " + description + " " + selected)
        
        let updateTaskDetails = await apiFunctions.updateTaskDetails(
            id,
            newProject, // projectId 
            newName, // title 
            description, // description
            hour, //estimated time
            selected, // status
            )

        console.log("selected: " + selected)


        if (updateTaskDetails) {
            console.log("task edited: " + newName + " -" + selected + "-");
            alert("Task Saved! " + newName);
            window.location.href='/task/'+id
            
        } else {
            console.log("failed to save task: ");
            alert("Task Failed to Save");
        }
    };

    useEffect(() => {
        console.log("reload");
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
                tagged.push(word);
            }
        });
        let newAdded = apiFunctions.createNewComment(newCommentBody, user.key, id, tagged);
        setComments([...comments, newAdded]);
    };

    const fetchData = async (event) => {
        console.log("fetched hello: ")
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)

        if (id !== undefined) {
            try {
                await onValue(ref(apiFunctions.db, 'tasks/' + id), (snapshot) => {
                    console.log("RESULT: " + JSON.stringify(snapshot.val()))
                    const val = snapshot.val()

                    setName(val.name)
                    setNewName(val.name)
                    setDesc(val.description)
                    setHour(val.estimatedTime)
                    setLabel(val.status)
                    setOwner(val.owners[1].firstName + " " +  val.owners[1].lastName)
                    setAssign(val.assignedUsers[1].firstName + " " +  val.assignedUsers[1].lastName)
                    setSelectedFollower(val.followers)
                    setProject(val.projectId[1].name)
                    console.log("project: " + val.projectId)
                    console.log("project: " + val.projectId[1].name)
                    
                    console.log("set task")

                    // //owner
                    // const ownerTemp = apiFunctions.getUserById(val.owner)[1]
                    // console.log("owner: " + JSON.stringify(ownerTemp))
                    // console.log("set hour: " + hour + " " + val.estimatedTime)

                    //assignee
                    // if (val.assignedUsers !== "") {
                    //     onValue(ref(apiFunctions.db, "users/" + val.assignedUsers), (snapshot) => {
                    //         setAssign(snapshot.val().firstName + " " + snapshot.val().lastName)
                    //     });
                    // }

                    console.log(name)

                    console.log("OK HERE" + val.projectId)
                    setProject(apiFunctions.getProjectById(val.projectId)[0][1].name)
                })
                

                if (taskListarr.length !== 0) {
                    setLoading(false)
                }
    
                //fetch comments as well
                const settingComments = apiFunctions.getTaskComments(id);
                console.log("set commnets");
                console.log(settingComments);
                setComments(settingComments);
            }
            catch {
                // if there is no internet
            }    
        }
        else {
            console.log("getting user data")
            setTaskListArr([])
            const taskTemp = apiFunctions.getUsersAssignedTasks(user.key);
            console.log("set Tasks")
            console.log(JSON.stringify(taskTemp))
            setTaskListArr(taskTemp)

            setFollowedTaskList([])
            const taskFollowedTemp = apiFunctions.getUsersFollowedTasks(user.key);
            console.log("set Tasks")
            console.log(JSON.stringify(taskFollowedTemp))
            setFollowedTaskList(taskFollowedTemp)
        }
        
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

        setLoading(false)
        console.log("taskListarr: " + taskListarr.length)
        return true;
    };

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
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
                                ?   <div>
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
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                            { showFollow
                                ? <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
                                flexDirection:"column",}} height={400}>
                                        { taskListarr && taskListarr.length != 0 ? taskListarr.map((data) => {
                                            return (
                                            <div key={data.projectId}>
                                                <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <TaskIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[1].name} secondary={data[1].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                        )}): "There are no tasks!" }
                                        <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%'}}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Task"}/>
                                            </ListItem>
                                        </Button>
                                </FixedSizeList>
                                : <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
                                flexDirection:"column",}} height={400}>
                                        { followedTaskListarr && followedTaskListarr.length != 0 ? followedTaskListarr.map((data) => {
                                            return (
                                            <div key={data.projectId}>
                                                <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <TaskIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[1].name} secondary={data[1].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                        )}): "There are no tasks!" }
                                        <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%'}}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Task"}/>
                                            </ListItem>
                                        </Button>
                                </FixedSizeList> }
                                
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
            </div>
        )
    }
    else {
        if (isEditing) {
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
                                        alignItems: 'right',
                                        width: '20%',
                                        mb: '-100px',
                                        mr: '-60px',
                                        ml: '50.0rem',
                                    }}>
                                        <Button
                                            onClick={handleClickOpen}
                                            variant="outlined"
                                            startIcon={<DeleteForeverIcon />}
                                            sx={{ mt: 3, mb: 2 }}
                                            >
                                        Delete
                                        </Button>
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
                                    <h2>Editing:<i> {name}</i></h2>
                                        <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'left',
                                            width: '20%',
                                            mt: '-80px',
                                        }}>
                                            <Button
                                                onClick={handleEditing}
                                                variant="outlined"
                                                startIcon={<ArrowBackIcon />}
                                                sx={{ mt: 3, mb: 2 }}
                                                >
                                            Back
                                            </Button>
                                            <br></br>
                                        </Box>
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
                                                    <InputLabel id="assignLabel">Label</InputLabel>
                                                    <Select
                                                        multiple
                                                        defaultValue={10}
                                                        value={selected}
                                                        onChange={selectionChangeHandler}
                                                        label="Label"
                                                        id="label"
                                                        textOverflow="ellipsis"
                                                        overflow="hidden"
                                                        renderValue={(selected) => (
                                                        <div>
                                                            { selected && selected.length !== 0 ? selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                            )): []}
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
                                                <InputLabel id="projectLabel">Project</InputLabel>
                                                <Select
                                                    labelId="projectLabel"
                                                    id="projectLabel"
                                                    label="Project"
                                                    fullWidth
                                                    defaultValue={id}
                                                    onChange={handleProjectChange}
                                                >
                                                    { projectList && projectList.length != 0 ? projectList.map((data) => 
                                                        <MenuItem value={data[1]}>{data[0].name}</MenuItem>
                                                    ): <MenuItem value={0}>New Project</MenuItem> }
                                                </Select>
                                                <FormHelperText>Previous values: {project}</FormHelperText>
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
                                            <InputLabel id="ownerLabel">Owner</InputLabel>
                                            <Select
                                                labelId="ownerLabelSelect"
                                                id="ownerSelect"
                                                label="ownerLabel"
                                                onChange={handleOwnerChange}
                                                defaultValue={owner}
                                                value={owner}
                                                disabled
                                            >
                                                { userList && userList.length != 0 ? userList.map((data) => 
                                                    <MenuItem value={data[1]}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                ): <MenuItem value={0}>New User</MenuItem> }
                                            </Select>
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
                                                value={assignee}
                                                disabled
                                            >
                                                { userList && userList.length != 0 ? userList.map((data) => 
                                                        <MenuItem value={data[1]}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                    ): <MenuItem value={0}>New User</MenuItem> }
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
                        <Button onClick={handleDelete}>Close</Button>
                        <Button onClick={handleClose} autoFocus>
                            Delete
                        </Button>
                        </DialogActions>
                    </Dialog>
                    {/* <LoadTasks></LoadTasks> */}
                    </div>
            );
        }
        else {
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
                                            alignItems: 'right',
                                            width: '26%',
                                            mb: '-100px',
                                            mr: '20rem',
                                            ml: '73%',
                                        }}>
                                            <Button
                                                onClick={handleMarkDone}
                                                variant="outlined"
                                                startIcon={<CheckIcon />}
                                                sx={{ mt: 3, mb: 2 }}
                                                >
                                            <b>{completed ? 'Mark as In Progress' : 'Mark as Complete'}</b> 
                                            </Button>
                                            <br></br>
                                        </Box>       
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                                >
                                    <h2>{name}</h2>
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <Grid container spacing={2}>
                                        <Grid item xs={50} sm={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Button onClick={handleClick} fullWidth>
                                                        <TextField
                                                        autoComplete="given-name"
                                                        name="taskName"
                                                        fullWidth
                                                        id="taskName"
                                                        value={name}
                                                        disabled
                                                        />
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Button onClick={handleClick} fullWidth>
                                                        <TextField
                                                        autoComplete="given-name"
                                                        name="label"
                                                        fullWidth
                                                        id="label"
                                                        value={label}
                                                        disabled
                                                        />
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Button onClick={handleClick} fullWidth>
                                                        <TextField
                                                        autoComplete="given-name"
                                                        name="label"
                                                        fullWidth
                                                        id="label"
                                                        value={hour + " hours"}
                                                        disabled
                                                        />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <Button onClick={handleClick} fullWidth>
                                                    <TextField
                                                            autoComplete="given-name"
                                                            name="project"
                                                            fullWidth
                                                            id="project"
                                                            value={project}
                                                            disabled
                                                            />
                                                        </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleClick} fullWidth>
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
                                            </Button>
                                        </Grid>
                                        </Grid>
        
                                        <br></br>
                                        <Divider>OWNERSHIP</Divider>
                                        <br></br>
                                        <Button onClick={handleClick} fullWidth>
                                            <TextField
                                                autoComplete="given-name"
                                                name="owner"
                                                fullWidth
                                                id="owner"
                                                value={owner}
                                                disabled
                                                />
                                        </Button>
        
                                        <br></br>
                                        <br></br>
                                        <Divider>ASSIGN</Divider>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                            <Button onClick={handleClick} fullWidth>
                                                <TextField
                                                    autoComplete="given-name"
                                                    name="assign"
                                                    fullWidth
                                                    id="assign"
                                                    value={assignee}
                                                    disabled
                                                />
                                                </Button>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Button
                                                    onClick={assignToMe}
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<CheckIcon />}
                                                    sx={{ mt: 1, mb: 2, height: '55px' }}
                                                    >
                                                <b>{assign ? 'Assigned to Me' : 'Assign to Me'}</b> 
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <br></br>
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
        
    }
    
}

export default Task;