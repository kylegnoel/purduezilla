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

const Groups = () => {
    const {id} = useParams();
    console.log("parameters: " + id);

    const theme = createTheme();
    const [group, setGroup] = useState('');

    const navigate = useNavigate();
    const user = apiFunctions.useFirebaseAuth();

    console.log(user);

    const [groupList, setGroupList] = useState([]);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {
        if (user === null) {
            //navigate('/');
        }

        setGroupList([])
        console.log("fetched hello: " + id)
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        if ( id === undefined ) {
            onValue(ref(apiFunctions.db, 'groups/'), (snapshot) => {
                const groupTemp = []
    
                snapshot.forEach(function(child) {
                    console.log("group name: " + child.val().name)
                    groupTemp.push([child.val(), child.key])
                })

                setGroupList(groupTemp)
            })
        }
        else {
            try {
                onValue(ref(apiFunctions.db, 'groups/'+id), (snapshot) => {
                    const groupTemp = []
        
                    snapshot.forEach(function(child) {
                        groupTemp.push([child.val(), child.key])
                    })
    
                    setGroupList(groupTemp)
                })
    
                // set project name
                onValue(ref(apiFunctions.db, "groups/" + id), (snapshot) => {
                    setGroup(snapshot.val().name)
                });
    
                
            }
            catch {
                // if there is no internet
            }
        }

        console.log("groupList: " + groupList.length)
        console.log("complete")
        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addgroup") {
            console.log("eventid: " + event.currentTarget.id)
            navigate('/group/'+event.currentTarget.id);
        }
        else {
            navigate('/newgroup/');
        }
    }

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
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
                                                                <WorkIcon color="grey"/>
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
    else {
        return (
            <div> 
                <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={50} sm={12}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
            flexDirection:"column",}} height={400}>
                                        <ListSubheader><h2>{group}</h2></ListSubheader>
                                            { groupList && groupList.length !== 0 ? groupList.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[0].name}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "There are no tasks!" }
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
                {/* <LoadTasks></LoadTasks> */}
                </div>
        );
        
    }
    
}

export default Groups;