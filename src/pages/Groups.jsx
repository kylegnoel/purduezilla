import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'; 

import NavBar from '../components/NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

import GroupsDashboard from '../components/GroupsDashboard';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';

const Groups = () => {
    const {id} = useParams();

    const theme = createTheme();
    const [group, setGroup] = useState('');
    const [projectListArr, setProjectList] = useState([]);
    const [taskListArr, setTaskListArr] = useState([]);

    const navigate = useNavigate();
    const user = apiFunctions.useFirebaseAuth();

    console.log(user);

    const [groupList, setGroupList] = useState([]);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {
        onValue(ref(apiFunctions.db, 'groups/' + id + '/projects'), (snapshot) => {
            console.log("group name: " + snapshot.val().name)
            setGroup(snapshot.val().name)

            const projectListTemp = []
            const projectLi = snapshot.val().projects

            console.log(projectLi)

            snapshot.forEach(function (childSnapshot) {
                const projectID = childSnapshot.val().name
                projectListTemp.push([projectID, childSnapshot.val()])
                console.log("value: " + JSON.stringify(childSnapshot.val()))
            })
            console.log("set project")
            console.log(projectListTemp)
            setProjectList(projectListTemp)
        })

        console.log("complete")
        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id === "addproject") {
            navigate('/newproject/');
        }
        else {
            console.log("eventid: " + event.currentTarget.id)
            navigate('/project/'+event.currentTarget.id);
        }
    }

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
                <GroupsDashboard></GroupsDashboard>
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
                        <h2>{group}</h2>
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={50} sm={12}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
            flexDirection:"column",}} height={400}>
                                            { projectListArr && projectListArr.length != 0 ? projectListArr.map((data) => {
                                                return (
                                                <div key={data[0]}>
                                                <Button onClick={handleTask} id={data[1].projectId} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[1].projectName}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "There are no projects!" }
                                            <Button onClick={handleTask} id={"addproject"} sx={{ height: '80%', width: '100%'}}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Project"}/>
                                            </ListItem>
                                        </Button>
                                    </FixedSizeList>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        );
        
    }
    
}

export default Groups;