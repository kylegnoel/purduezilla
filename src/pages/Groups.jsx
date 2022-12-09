import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'; 
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

import NavBar from '../components/NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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
import ClearIcon from '@mui/icons-material/Clear';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';



import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import DialogTitle from '@mui/material/DialogTitle';

import IconButton from '@mui/material/IconButton';

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
    const [taskListArr, setTaskListArr] = React.useState([]);
    const [owners, setOwners] = useState([]);
    const [members, setMembers] = useState([]);
    const [viewers, setViewers] = useState([]);

    const [permissions, setPermissions] = useState(0);
    const [canEdit, setCanEdit] = useState(0);
    const [isOwner, setOwner] = useState(0);
    const [newOwner, setNewOwner] = useState("")
    const [userTemp, setUserTemp] = useState("")
    const [viewerTemp, setViewerTemp] = useState("")


    const [expanded, setExpanded] = React.useState(false);

    const settings = ["Edit Description", 'Delete Group', 'Transfer Ownership'];
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openUser, setWarningOpen] = React.useState(false);
    const [openViewer, setViewerOpen] = React.useState(false);

    const [openVal, setOpenVal] = React.useState(false);

    const [userList, setUserList] = useState([]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const showUser = (event) => {
        console.log(event.currentTarget.id)
        navigate('/profile/' + event.currentTarget.id);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleViewerClose = () => {
        setViewerOpen(false);
    };

    const closeChange = () => {
        setOpenVal(false);
    };

    const handleButtonClick = async (setting) => {
        setAnchorElUser(null);
        if (setting === 'Delete Group') {
            setOpen(true)
        } else if (setting === 'Edit Description') {
            setOpenVal(true)
        } else if (setting === 'Transfer Ownership') {
            setOpenVal(true)
        } 
    }

    const handleDelete = (event) => {
        setOpen(false);
        alert("Group Deleted.")

        // to do implement delete
        apiFunctions.deleteItemById("group",id);
        navigate("/home")
    }

    const removeUser = (event) => {
        setWarningOpen(true);
        setUserTemp(event.currentTarget.id)
    }

    const removeViewer = (event) => {
        setViewerOpen(true);
        setViewerTemp(event.currentTarget.id)
    }


    const handleDeleteUser = (event) => {
        setWarningOpen(false);

        // to do implement delete
        apiFunctions.deleteMemberFromGroup(id, userTemp);
        navigate("/mygroups")
    }

    const handleDeleteViewer = (event) => {
        setViewerOpen(false);

        // to do implement delete
        apiFunctions.deleteViewerFromGroup(id, viewerTemp);
        navigate("/mygroups")
    }

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = async (event) => {
        const userTemp = (await apiFunctions.getObjectById("users",""))
        console.log("userTemp: " + JSON.stringify(userTemp))
        setUserList(userTemp)

        if (id !== undefined) {
            const permTemp = (await apiFunctions.isGroupMember(user.key, id));
            setPermissions(permTemp)
            if (permTemp === 1 || permTemp === 2) {
                setCanEdit(1)
            }
            if (permTemp === 1) {
                setOwner(1)
            }
            // if (permTemp === 0) {
            //     navigate("/mygroups")
            // }
            console.log("permission: " + permTemp)

            const currGroup =  (await apiFunctions.getObjectById("/groups", id))[0]
            setGroup(currGroup[1].name)
            setDesc(currGroup[1].description)

            // set groups projects
            const projectListTemp = (await apiFunctions.getGroupsProjects(id))
            setProjectList(projectListTemp)
            // console.log("projectListTemp: " + projectListArr)

            // get owners
            const groupOwners = (await apiFunctions.getGroupsMembers("ownerId", id))
            setOwners(groupOwners)
            // console.log("owners: " + groupOwners)

            // get members
            const groupMembers = (await apiFunctions.getGroupsMembers("members", id))
            setMembers(groupMembers)
            // console.log("members: " + groupMembers)


            // get viewers
            const groupViewers = (await apiFunctions.getGroupsMembers("viewers", id))
            setViewers(groupViewers)
            // console.log("viewers: " + groupViewers)

            const taskListTemp = (await apiFunctions.getGroupsTasks(id))
            // console.log("taskList: " + JSON.stringify(taskListArr))
            setTaskListArr(taskListTemp)
        }
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
            navigate('/task/'+event.currentTarget.id);
        }
    }

    const handleProject = (event) => {
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

    const handleSubmit = async (event) => {
        console.log("owner final: " + newOwner)

        let changeOwner = await apiFunctions.changeGroupOwner(id, newOwner);

        alert("Owner Transfered!")

        closeChange();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOwnerChange = event => {
        console.log("owner: " + event.target.value)
        setNewOwner(event.target.value)
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
                        <h2><i>Group: </i>{group}</h2>
                        <Divider></Divider>
                        <br></br>
                        {isOwner ? <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip title="Open settings">
                                <Button
                                    width='20%'
                                    variant="outlined"
                                    onClick={handleOpenUserMenu}
                                    startIcon={<ExpandMoreIcon />} >
                                    <b>Options</b> 
                                </Button>
                                </Tooltip>
                                <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleButtonClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                                </Menu>
                            </Box> : ''}
                        <Box sx={{ mt: 2 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={50} sm={6}>
                                    <h3>Group Projects</h3>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',minHeight:400, maxHeight:400, overflowY:'auto',flexGrow: 1, mt: '0px',
            flexDirection:"column",}} height={600}>
                                            { projectListArr && projectListArr.length != 0 ? projectListArr.map((data) => {
                                                return (
                                                <div key={data[0]}>
                                                <Button onClick={handleProject} id={data[1].projectId} sx={{ height: '100%', width: '100%'}}>
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
                                    {canEdit ? <Button 
                                        onClick={handleProject} 
                                        id={"addproject"} 
                                        variant="outlined"
                                        sx={{ mt: '10px', width: '100%'}}>
                                        Create New Project
                                        </Button> : ''}
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
                                                        primary={<Link onClick={showUser} id={data[0]} fullWidth>{data[1].firstName + " " + data[1].lastName}</Link>}
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
                                                        primary={<Link onClick={showUser} id={data[0]} fullWidth>{data[1].firstName + " " + data[1].lastName}</Link>}
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
                                                        <ListItemAvatar>
                                                        <IconButton id={data[0]} onClick={removeUser} aria-label="delete"  color="primary">
                                                            <ClearIcon />
                                                        </IconButton>
                                                        </ListItemAvatar>
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
                                                    primary={<Link onClick={showUser} id={data[0]} fullWidth>{data[1].firstName + " " + data[1].lastName}</Link>}
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
                                                    <ListItemAvatar>
                                                    <IconButton id={data[0]} onClick={removeViewer} aria-label="delete"  color="primary">
                                                        <ClearIcon />
                                                    </IconButton>
                                                    </ListItemAvatar>
                                                    </ListItem>
                                                );
                                            }): "There are no viewers in this group!" }
                                            </AccordionDetails>
                                        </Accordion>
                                </Grid>
                                <Grid item xs={50} sm={12}>
                                    <Divider></Divider>
                                    <h3>Group Tasks</h3>
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
                                            {canEdit ? <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%'}}>
                                            
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Create New Task"}/>
                                            </ListItem>
                                        </Button> : ''}
                                    </FixedSizeList>
                                </Grid>
                            </Grid>
                        </Box>
                            <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want to delete this group?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Close</Button>
                                <Button onClick={handleDelete} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openUser}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want to remove this user?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Close</Button>
                                <Button onClick={handleDeleteUser} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openViewer}
                            onClose={handleViewerClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want to remove this user?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleViewerClose}>Close</Button>
                                <Button onClick={handleDeleteViewer} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>


                        <Dialog
                            open={openVal}
                            onClose={closeChange}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Change the owner"}
                            </DialogTitle>
                            <DialogContent>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="ownerLabel">Owner</InputLabel>
                                        <Select
                                            labelId="ownerLabelSelect"
                                            id="ownerSelect"
                                            label="ownerLabel"
                                            onChange={handleOwnerChange}
                                            defaultValue={10}
                                        >
                                            {userList && userList.length != 0 ? userList.map((data) =>
                                                <MenuItem value={data[0]}>{data[1].firstName + " " + data[1].lastName}</MenuItem>
                                            ) : <MenuItem value={0}>New User</MenuItem>}
                                        </Select>
                                        <FormHelperText>Select the team member who oversees this group.</FormHelperText>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeChange}>Close</Button>
                                <Button onClick={handleSubmit} autoFocus>
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </ThemeProvider>
            </div>
        );
        
    }
    
}

export default Groups;