import React from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import History from '../components/HistoryDashboard';
import { Typography } from '@mui/material';
import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskIcon from '@mui/icons-material/Task';

import '../App.css'
const theme = createTheme();

const Dashboard = () => {
    const { id } = useParams();
    const user = apiFunctions.useFirebaseAuth();

    const [projListarr, setProjListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [taskListarr, setTaskListArr] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addproject") {
            window.location.href='/project/'+event.currentTarget.id;
            //window.location.reload()
        }
        else {
            window.location.href='/newproject/';
        }
    }

    const fetchData = async (event) => {
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        const settingProjects = apiFunctions.getUsersProjects(user.key);
        await setProjListArr(settingProjects);

        const settingTasks = apiFunctions.getUsersAssignedTasks(user.key);
        await setTaskListArr(settingTasks);

        setLoading(false)
        
        return true;
    };

    return (
        <div>
            <NavBar></NavBar>
            <div class="flex-container">
<div style={{marginBottom: '-16px'}}class="flex-child">
                <Typography
                variant="h5"
                maxWidth={'9em'}
                marginBottom='-16px'
                marginLeft='24px'
                marginTop='24px'
                noWrap
                href=""
                sx={{
                mr: 2,
                textAlign: 'center',
                display: { xs: 'flex'},
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                }}
                >
            Historical Feed
          </Typography>
                </div>
                <div style={{marginBottom: '-16px'}}class="flex-child">
                <Typography
                variant="h5"
                maxWidth={'9em'}
                marginBottom='-16px'
                marginLeft='24px'
                marginTop='24px'
                noWrap
                href=""
                sx={{
                mr: 2,
                textAlign: 'center',
                display: { xs: 'flex'},
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                }}
                >
            Followed Tasks Feed
          </Typography>
                </div>
            </div>


            <div class="flex-container">
                <div class="flex-child">
                    <History></History>
                </div>
                <div class="flex-child">
                <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={50} sm={12} lg={'50%'}>
                            <FixedSizeList sx={{
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
                                        <ListItemText primary={"Add Task"} />
                                    </ListItem>
                                </Button>
                            </FixedSizeList>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
        <Typography
        variant="h5"
        maxWidth={'9em'}
        marginBottom='-16px'
        marginLeft='24px'
        marginTop='24px'
        noWrap
        href=""
        sx={{
        mr: 2,
        textAlign: 'center',
        display: { xs: 'flex'},
        flexGrow: 1,
        fontFamily: 'monospace',
        fontWeight: 700,
        color: 'inherit',
        textDecoration: 'none',
        }}
        >
            Projects Feed
          </Typography>
                    <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="lg">
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={50} sm={12} lg={'50%'}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:400, overflowY:'auto',flexGrow: 1,
            flexDirection:"column",}} height={400}>
                                        { projListarr && projListarr.length != 0 ? projListarr.map((data) => {
                                                return (  
                                                <div key={data[1]}>
                                                <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[1].name} secondary="Content was changed"/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "There are no Projects!" }
                                        <Button onClick={handleTask} id={"addproject"} sx={{ height: '80%', width: '100%'}}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <AddIcon color="grey"/>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={"Add Project"}/>
                                                </ListItem>
                                            </Button>
                                    </FixedSizeList>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </ThemeProvider>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;