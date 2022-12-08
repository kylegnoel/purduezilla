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

// db import
import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

// components import
import NavBar from '../components/NavBar';
import ProjectDashboard from '../components/ProjectDashboard';
import CommentBox from '../components/comments';

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

    useEffect(() => {
        fetchData()
    }, []);

    const createComment = (event) => {
        event.preventDefault();
        console.log(comments);
        apiFunctions.createNewProjectComment(newCommentBody, user.key, id, user.info.firstName);
        // console.log(comments);
        console.log(user.key);
        //setComments([...comments, { body: newCommentBody, author: user.key }]);
        // console.log(comments);
        // console.log(user.key);
        // window.location.reload();
        setNewCommentBody("");
        window.location.reload(false);
    }

    const updateComment = (authorKey, authorName, commentKey, newBody) => {
        apiFunctions.updateProjectComment(commentKey, newBody, authorKey, authorName, id);
        window.location.reload(false);
    }
    const deleteComment = (commentKey) => {
        apiFunctions.deleteProjectComment(commentKey, id);
        window.location.reload(false);
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
                        <h2>{project}</h2>
                        <Button component={Link} to={window.location.pathname + "/storyboard"} variant="contained">View Project Storyboard</Button>
                        <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={50} sm={12}>
                                    <Divider></Divider>
                                    <TextField
                                        fullWidth
                                        multiline
                                        disabled
                                        rows={4}
                                        id="taskDescription"
                                        label="Task Description"
                                        name="taskDescription"
                                        value={description}
                                        sx={{ mt: 2, mb: 2 }}
                                    />
                                    <FixedSizeList sx={{
                                        border: 1, borderColor: 'black', maxHeight: 600, overflowY: 'auto', flexGrow: 1,
                                        flexDirection: "column", mt: 2
                                    }} height={400}>
                                        {taskListarr && taskListarr.length !== 0 ? taskListarr.map((data) => {
                                            return (
                                                <div key={data.key}>
                                                    <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%' }}>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <WorkIcon color="grey" />
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
                                </Grid>
                                <Grid>
                                    {comments.map((comment) => (

                                        < div >
                                            <CommentBox
                                                infoObject={{
                                                    ownComment: user.key === comment[0].author,
                                                    authorKey: comment[0].author,
                                                    authorName: comment[0].firstName,
                                                    body: comment[0].body,
                                                    commentKey: comment[1],
                                                }}
                                                handleCommentDelete={deleteComment}
                                                handleCommentUpdate={updateComment}
                                            ></CommentBox>
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
                        </Box>
                    </Container>
                </ThemeProvider>
                {/* <LoadTasks></LoadTasks> */}
            </div>
        );

    }

}

export default Projects;