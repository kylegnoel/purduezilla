import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material ui imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';


// db import
import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

// components import
import NavBar from '../components/NavBar';
import ProjectDashboard from '../components/ProjectDashboard';

const Projects = () => {
    const { id } = useParams();

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [project, setProject] = useState('');
    const [description, setDesc] = useState('');
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState("");

    const user = apiFunctions.useFirebaseAuth();
    const [owners, setOwners] = useState([]);
    const [members, setMembers] = useState([]);
    const [viewers, setViewers] = useState([]);

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const showUser = (event) => {
        console.log(event.currentTarget.id)
        navigate('/profile/' + event.currentTarget.id);
    }

    useEffect(() => {
        fetchData()
    }, []);

    const createComment = (event) => {
        event.preventDefault();
        console.log(comments);
        apiFunctions.createNewProjectComment(newCommentBody, user.key, id);
        // console.log(comments);
        console.log(user.key);
        setComments([...comments, { body: newCommentBody, author: user.key }]);
        // console.log(comments);
        // console.log(user.key);
        // window.location.reload();
        setNewCommentBody("");

    }

    const fetchData = async (event) => {
        setTaskListArr([]);
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        if (id === undefined) {

        }
        else {
            // set project tasks
            const finishedArr = await apiFunctions.getProjectsTasks(id);
            setTaskListArr(finishedArr);

            const currProject = (await apiFunctions.getProjectById(id))[0];
            console.log(currProject)
            setProject(currProject[1].name);
            setDesc(currProject[1].description);

            const groupOwners = (await apiFunctions.getProjectOwners("ownerId", id))
            setOwners(groupOwners)
            console.log("owners: " + groupOwners)

            // get members
            const groupMembers = (await apiFunctions.getProjectMembers("memberId", id))
            setMembers(groupMembers)
            console.log("members: " + groupMembers)


            // get viewers
            const groupViewers = (await apiFunctions.getProjectMembers("viewerId", id))
            setViewers(groupViewers)
            console.log("viewers: " + groupViewers)

            setComments(apiFunctions.getProjectComments(id));
        }

        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            navigate('/task/' + event.currentTarget.id);
        }
        else {
            navigate('/newtask/' + id);
        }
    }

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
                <br></br>
                <h2>My Projects</h2>
                <ProjectDashboard></ProjectDashboard>
            </div>
        );
    }
    else {
        return (
            <div>
                <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <br></br>
                        <h2><i>Project: </i>{project}</h2>
                        <Button sx={{mb: 2 }} component={Link} to={window.location.pathname + "/storyboard"} variant="contained">View {project} Storyboard</Button>
                        <br></br>
                        <Divider></Divider>
                        <Box sx={{ mt: 0, mb: 6, }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2}>
                                <Grid item xs={50} sm={6}>
                                    <h3>Projects Tasks</h3>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',minHeight:400, maxHeight:400, overflowY:'auto',flexGrow: 1, mt: '0px',
            flexDirection:"column",}} height={600}>
                                            { taskListarr && taskListarr.length != 0 ? taskListarr.map((data) => {
                                                return (
                                                <div key={data[0]}>
                                                <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[1].name} secondary={data[1].description} />
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "There are no tasks in this project!" }
                                    </FixedSizeList>
                                    <Button 
                                        onClick={handleTask} 
                                        id={"addtask"} 
                                        variant="outlined"
                                        sx={{ mt: '10px', width: '100%'}}>
                                        Create New Task
                                        </Button>
                                </Grid>
                                <Grid item xs={50} sm={6} sx={{ mt: 0 }}>
                                    <h3>Description</h3>
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
                                            Project Owners
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            Project Members who created/own the group.
                                        </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>  
                                            { owners && owners.length !== 0 && owners !== {} ? owners.map((data) => {
                                                return(
                                                    <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={data[1].firstName + " " + data[1].lastName} src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <Link onClick={showUser} id={data[0]} fullWidth>
                                                        <ListItemText
                                                        primary={data[1].firstName + " " + data[1].lastName}
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
                                                    </Link>
                                                </ListItem>
                                                );
                                            }): "There are no owners in this project!" }
                                        </List>
                                        </AccordionDetails>
                                    </Accordion>
                                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2bh-content"
                                            id="panel2bh-header"
                                            >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Members</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Members who can create/edit a task in this project.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>  
                                                { members && members.length !== 0 && members !== {} ? members.map((data) => {
                                                return(
                                                    <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={data[1].firstName + " " + data[1].lastName} src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <Link onClick={showUser} id={data[0]} fullWidth>
                                                        <ListItemText
                                                        primary={data[1].firstName + " " + data[1].lastName}
                                                        secondary={
                                                            <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                Member
                                                            </Typography>
                                                            </React.Fragment>
                                                        }
                                                        />
                                                    </Link>
                                                </ListItem>
                                                );
                                            }): "There are no members in this project!" }
                                            </List>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel3bh-content"
                                            id="panel3bh-header"
                                            >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                Viewers
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Users who can only view this project.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            { viewers && viewers.length !== 0 && viewers !== {} ? viewers.map((data) => {
                                                return(
                                                    <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={data[1].firstName + " " + data[1].lastName} src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <Link onClick={showUser} id={data[0]} fullWidth>
                                                        <ListItemText
                                                        primary={data[1].firstName + " " + data[1].lastName}
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
                                                    </Link>
                                                    </ListItem>
                                                );
                                            }): "There are no viewers in this project!" }
                                            </AccordionDetails>
                                        </Accordion>
                                </Grid>
                            </Grid>
                            </Box>
                            <Divider></Divider>
                            <Grid fullWidth xs={50} sm={12}>
                                <Grid>
                                    {comments.map((comment) => (
                                        < div >
                                            <p> author key: {comment.author}</p>
                                            <p>body: {comment.body}</p>
                                        </div>
                                    ))}
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
                                    <Button onClick={createComment}>New Comment</Button>
                                </Grid>
                            </Grid>
                    </Container>
                </ThemeProvider>
                {/* <LoadTasks></LoadTasks> */}
            </div>
        );

    }

}

export default Projects;