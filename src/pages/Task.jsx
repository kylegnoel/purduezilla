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
    const { id } = useParams();
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
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState('');
    // const [taggingBody, setTaggingBody] = useState('');

    const user = apiFunctions.useFirebaseAuth();
    const [isEditing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    
    const [selectedFollower, setSelectedFollower] = useState([]);

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

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            console.log("eventid: " + event.currentTarget.id)
            // navigate('/task/'+event.currentTarget.id);
            window.location.href='/task/'+event.currentTarget.id
        }
        else {
            // navigate('/newtask');
            window.location.href='/newtask/'
        }
    }

    const handleClick = (event) => {
        if (event.detail === 2) {
            console.log('double click');
            setEditing(!isEditing)
          }
    }

    const handleEditing = (event) => {
        setEditing(false)
    }

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

    const fetchData = (event) => {
        if (user === null) {
            navigate('/');
        }

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

            //fetch comments as well
            const settingComments = apiFunctions.getTaskComments(id);
            console.log("set commnets");
            console.log(settingComments);
            setComments(settingComments);
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
                    <h2>My Tasks</h2>
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                            <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                        { taskListarr && taskListarr.length != 0 ? taskListarr.map((data) => {
                                            return (
                                            <div key={data.projectId}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <TaskIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
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
                                                        value={name}
                                                        />
                                                </Grid>
                                                <Grid item xs={12}>
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
                                                defaultValue={owner[0]}
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
                                                defaultValue={assignee[0]}
                                            >
                                                { userList && userList.length != 0 ? userList.map((data) => 
                                                        <MenuItem value={data[1]}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                    ): <MenuItem value={0}>New User</MenuItem> }
                                            </Select>
                                            <FormHelperText>Select the team member who is assigned to this task.</FormHelperText>
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            >
                                        Save Changes
                                        </Button>
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
                                    alignItems: 'center',
                                }}
                                >
                                    <Box sx={{ mt: 6 }}>
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
                                                <Grid item xs={12}>
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
                                        <br></br>
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