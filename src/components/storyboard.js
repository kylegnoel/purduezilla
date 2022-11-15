import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography } from '@mui/material';
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
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FixedSizeList from '@mui/material/List';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import ProjectDashboard from '../components/ProjectDashboard';
import {Route, Link, Routes, useParams} from 'react-router-dom'; 


import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const card = {
  name: "Example name",
  description:
    "Example description"
};
export default function SimpleCard() {
    const {id} = useParams();

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [project, setProject] = useState('');
    const [description, setDesc] = useState('');
    const navigate = useNavigate();

    const [toDo, setToDo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [inTesting, setInTesting] = useState([]);
    const [completed, setCompleted] = useState([]);

    const handleClickOpen = () => {

    };

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        setTaskListArr([])
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        if ( id === undefined ) {

        }
        else {
            try {
                onValue(ref(apiFunctions.db, 'tasks/'), (snapshot) => {
                    const todoTemp = []
                    const inprogressTemp = []
                    const intestingTemp = []
                    const completedTemp = []
        
                    snapshot.forEach(function(child) {
                        const task = child.val()
                        if (task.status === "To Do") {
                            todoTemp.push([task, child.key])
                        }
                        else if (task.status === "In Progress") {
                            inprogressTemp.push([task, child.key])
                        }
                        else if (task.status === "In Testing") {
                            intestingTemp.push([task, child.key])
                        }
                        else if (task.status === "Completed") {
                            completedTemp.push([task, child.key])
                        }
                    })
    
                    setToDo(todoTemp)
                    setInProgress(inprogressTemp)
                    setInTesting(intestingTemp)
                    setCompleted(completedTemp)
                })
    
                // set project name
                onValue(ref(apiFunctions.db, "projects/" + id), (snapshot) => {
                    setProject(snapshot.val().name)
                    setDesc(snapshot.val().description)
                });
    
                if (taskListarr.length !== 0) {
                    setLoading(false)
                }
            }
            catch {
                // if there is no internet
            }
        }

        setLoading(false)
        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            navigate('/task/'+event.currentTarget.id);
        }
        else {
            navigate('/newtask/'+id);
        }
    }

    if (id === undefined) {
        return (
            <div>
                <br></br>
                <h2>My Projects</h2>
                <ProjectDashboard></ProjectDashboard>
            </div>
        );
    }
    else {
        return (
            <div> 
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <br></br>
                        <h2>{project}</h2>
                        
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2} direction="row" alignItems="stretch" >
                                <Grid item sm={3}>
                                    <Typography><h3>To Do</h3></Typography>
                                    <Divider></Divider>
                                    <FixedSizeList fullWidth sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 10, flexDirection:"column", mt:2 }} height={400}>
                                            { toDo && toDo.length != 0 ? toDo.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "" }
                                    </FixedSizeList>                          
                                </Grid>
                                <Grid item sm={3}>
                                    <Typography><h3>In Progress</h3></Typography>
                                    <Divider></Divider>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 2, flexDirection:"column", mt:2 }} height={400}>
                                            { inProgress && inProgress.length != 0 ? inProgress.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "" }
                                    </FixedSizeList>   
                                </Grid>
                                <Grid item sm={3}>
                                    <Typography><h3>In Testing</h3></Typography>
                                    <Divider></Divider>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 2, flexDirection:"column", mt:2 }} height={400}>
                                            { inTesting && inTesting.length != 0 ? inTesting.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "" }
                                    </FixedSizeList>   
                                </Grid>
                                <Grid item sm={3}>
                                    <Typography><h3>Completed</h3></Typography>
                                    <Divider></Divider>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 2, flexDirection:"column", mt:2 }} height={400}>
                                            { completed && completed.length != 0 ? completed.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "" }
                                    </FixedSizeList>   
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
