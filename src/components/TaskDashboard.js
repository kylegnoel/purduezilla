import * as React from 'react';
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
import WorkIcon from '@mui/icons-material/Work';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import AddTask from './AddTask';

const theme = createTheme();

export default function TaskDashboard() {
    const [taskListarr, setTaskListArr] = useState([]);
    const [task, setTask] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            console.log("eventid: " + event.currentTarget.id)
            navigate('/task/'+event.currentTarget.id);
        }
        else {
            navigate('/newtask');
        }
    }
        

    const fetchData = (event) => {
        console.log("hello")
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        try {
            onValue(ref(apiFunctions.db, 'tasks/'), (snapshot) => {
                    const taskTemp = []
        
                    snapshot.forEach(function(child) {
                        const task = child.val()
                        taskTemp.push([task, child.key])
                        console.log("key: " + child.key);
                    })

                    setTaskListArr(taskTemp)
                    console.log("snapshot: " + taskListarr.length + " " +  taskTemp.length)
            })
            if (taskListarr.length !== 0) {
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

    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
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
                                                <ListItemText primary={"Add Task"}/>
                                            </ListItem>
                                        </Button>
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}