import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'; 
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

import NavBar from '../components/NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FixedSizeList from '@mui/material/List';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import apiFunctions from '../firebase/api';

import GroupsDashboard from '../components/GroupsDashboard';

const Groups = () => {
    const {id} = useParams();

    const theme = createTheme();
    const [group, setGroup] = useState('');
    const [description, setDesc] = useState('');
    const [projectListArr, setProjectList] = useState([]);

    const navigate = useNavigate();
    const user = apiFunctions.useFirebaseAuth();
    const [curUser, setUser] = useState('');

    const [groupList, setGroupList] = useState([]);

    const [owners, setOwners] = useState([]);
    const [members, setMembers] = useState([]);
    const [viewers, setViewers] = useState([]);

    const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = async (event) => {
        const currGroup =  (await apiFunctions.getObjectById("groups", id))[0]
        setGroup(currGroup[1].name)
        setDesc(currGroup[1].description)

        // set groups projects
        const projectListTemp = (await apiFunctions.getGroupsProjects(id))
        setProjectList(projectListTemp)
        console.log("projectListTemp: " + projectListArr)

        // get owners
        const groupOwners = (await apiFunctions.getGroupsMembers("owners", id))
        setOwners(groupOwners)

        // get members
        const groupMembers = (await apiFunctions.getGroupsMembers("members", id))
        setMembers(groupMembers)

        // get viewers
        const groupViewers = (await apiFunctions.getGroupsMembers("viewers", id))
        setViewers(groupViewers)

        const taskListTemp = (await apiFunctions.getGroupsTasks(id))
        console.log("taskList: " + JSON.stringify(taskListArr))
        setTaskListArr(taskListTemp)

        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id === "addproject") {
            navigate('/newproject/' + id);
        }
        else if (event.currentTarget.id === "addtask") {
            navigate('/newtask/');
        }
        else {
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
                    <Container component="main" maxWidth="lg">
                        <br></br>
                        <h2>{group}</h2>
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={50} sm={6}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',minHeight:400, maxHeight:400, overflowY:'auto',flexGrow: 1, mt: '0px',
            flexDirection:"column",}} height={600}>
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
                                            )}): "There are no projects in this group!" }
                                    </FixedSizeList>
                                    <Button 
                                        onClick={handleTask} 
                                        id={"addproject"} 
                                        variant="outlined"
                                        sx={{ mt: '10px', width: '100%'}}>
                                        Create New Project
                                        </Button>
                                </Grid>
                                <Grid item xs={50} sm={6} sx={{ mt: 0 }}>
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
                                            Group Owners
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            Group Members who created/own the group.
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
                                                </ListItem>
                                                );
                                            }): "There are no owners in this group!" }
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
                                                Members who can create/edit a project in this group.
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
                                                </ListItem>
                                                );
                                            }): "There are no members in this group!" }
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
                                                Users who can only view the group.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            { viewers && viewers.length !== 0 && viewers !== {} ? viewers.map((data) => {
                                                return(
                                                    <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt={data[1].firstName + " " + data[1].lastName} src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
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
                                                </ListItem>
                                                );
                                            }): "There are no viewers in this group!" }
                                            </AccordionDetails>
                                        </Accordion>
                                </Grid>

                                <Grid item xs={50} sm={12}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
            flexDirection:"column",}} height={400}>
                                            { taskListArr && taskListArr.length != 0 ? taskListArr.map((data) => {
                                                return (
                                                <div key={data[0]}>
                                                <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
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