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
import GroupIcon from '@mui/icons-material/Group';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import AddTask from './AddTask';

const theme = createTheme();

export default function GroupsDashboard() {
    const theme = createTheme();
    const [group, setGroup] = useState('');
    const [projectListArr, setProjectList] = useState([]);
    const [taskListArr, setTaskListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [groupList, setGroupList] = useState([]);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id === "addgroup") {
            window.location.href='/newgroup/';
            // navigate('/newgroup/');
        }
        if (event.currentTarget.id === "addproject") {
            window.location.href='/newproject/';
            // navigate('/newproject/');
        }
        else {
            // console.log("eventid: " + event.currentTarget.id)
            window.location.href='/group/'+event.currentTarget.id;
            // navigate('/group/'+event.currentTarget.id);
        }
    }


    const fetchData = (event) => {
        // console.log("hello")
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // // console.log("response: " + response)
        try {
            onValue(ref(apiFunctions.db, 'groups/'), (snapshot) => {
                const groupTemp = []
    
                snapshot.forEach(function(child) {
                    // console.log("group name: " + child.val().name)
                    groupTemp.push([child.val(), child.key])
                })

                setGroupList(groupTemp)
            })

        }
        catch {
            // if there is no internet
        }

        setLoading(false)

        return true;
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <br></br>
                    <h2>My Groups</h2>
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12}>
                                <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                        { groupList && groupList.length != 0 ? groupList.map((data) => {
                                            return (
                                            <div key={data[1]}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <GroupsIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[0].name}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                        )}): "You aren't in any groups!" }
                                        <Button onClick={handleTask} id={"addgroup"} sx={{ height: '80%', width: '100%'}}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <AddIcon color="grey"/>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Create New Group"}/>
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