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

import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';

import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import DialogTitle from '@mui/material/DialogTitle';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';


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

    const [open, setOpen] = React.useState(false);

    const [permissions, setPermissions] = useState(0);
    const [canEdit, setCanEdit] = useState(0);
    const [isOwner, setOwner] = useState(0);
    const [isNotMember, setNonMember] = useState(0);
    const [openVal, setOpenVal] = React.useState(false);
    const [newOwner, setNewOwner] = useState("")
    const [userList, setUserList] = useState([]);
    const [userTemp, setUserTemp] = useState("")
    const [completed, setCompleted] = useState(0)
    const [todo, setToDo] = useState(0)
    const [inProgress, setProgress] = useState(0)

    const settings = ["Edit Description", 'Delete Project', 'Transfer Ownership'];
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [expanded, setExpanded] = React.useState(false);
    const [openUser, setWarningOpen] = React.useState(false);


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteUser = (event) => {
        setWarningOpen(false);

        // to do implement delete
        apiFunctions.deleteMemberFromProject(id, userTemp);
        navigate("/myprojects/")
    }

    const showUser = (event) => {
        console.log(event.currentTarget.id)
        navigate('/profile/' + event.currentTarget.id);
    }

    const handleButtonClick = async (setting) => {
        setAnchorElUser(null);
        if (setting === 'Delete Project') {
            setOpen(true)
        } else if (setting === 'Transfer Ownership') {
            setOpenVal(true)
        } 
    }

    const handleOwnerChange = event => {
        console.log("owner: " + event.target.value)
        setNewOwner(event.target.value)
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSubmit = async (event) => {
        console.log("owner final: " + newOwner)

        let changeOwner = await apiFunctions.changeProjectOwner(id, newOwner);

        alert("Owner Transfered!")

        closeChange();
        navigate("/project/"+id)
    };

    const removeUser = (event) => {
        setWarningOpen(true);
        setUserTemp(event.currentTarget.id)
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
        const userListTemp = (await apiFunctions.getObjectById("users", ""))
        console.log("returned: " + JSON.stringify(userListTemp))
        setUserList(userListTemp)

        setCompleted(await apiFunctions.getHoursByStatus("Completed", id))
        setToDo(await apiFunctions.getHoursByStatus("To Do", id))
        setProgress(await apiFunctions.getHoursByStatus("In Progress", id))

        if (id === undefined) {

        }
        else {
            const permTemp = (await apiFunctions.isProjectMember(user.key, id));
            console.log("permission is: " + JSON.stringify(permTemp))
            setPermissions(permTemp)
            if (permTemp === 1 || permTemp === 2) {
                setCanEdit(1)
            }
            if (permTemp === 0 || permTemp === 3) {
                setNonMember(1)
            }
            if (permTemp === 1) {
                setOwner(1)
            }

            // set project tasks
            const finishedArr = await apiFunctions.getProjectsTasks(id);
            setTaskListArr(finishedArr);

            const currProject = (await apiFunctions.getObjectById("projects", id))[0];
            console.log(currProject)
            setProject(currProject[1].name);
            setDesc(currProject[1].description);

            const groupOwners = (await apiFunctions.getProjectMembers("owner", id))
            setOwners(groupOwners)
            console.log("owners: " + groupOwners)

            // get members
            const groupMembers = (await apiFunctions.getProjectMembers("members", id))
            setMembers(groupMembers)
            console.log("members: " + groupMembers)

            setComments(apiFunctions.getProjectComments(id));
        }

        return true;
    };

    const closeChange = () => {
        setOpenVal(false);
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            navigate('/task/' + event.currentTarget.id);
        }
        else {
            navigate('/newtask/' + id);
        }
    }

    const handleDelete = (event) => {
        setOpen(false);
        alert("Project Deleted.")

        // to do implement delete
        apiFunctions.deleteItemById("project",id);
        navigate("/myprojects")
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
                            <br></br>
                        <Divider></Divider>
                        <Box sx={{ mt: 0, mb: 6, }} display="flex" style={{textAlign: "center"}}>
                        <Grid container justifyContent="center" spacing={2} >
                                { isNotMember ? '' :
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
                                }
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
                                                    </Link>
                                                    <ListItemAvatar>
                                                        <IconButton id={data[0]} onClick={removeUser} aria-label="delete"  color="primary">
                                                            <ClearIcon />
                                                        </IconButton>
                                                        </ListItemAvatar>
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
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Project Statistics</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Members who can create/edit a task in this project.
                                            </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <b><u>Project Hours</u></b>
                                                To Do ${todo}
                                                In Progress: ${inProgress}
                                                Completed: ${completed}

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

                            <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure you want to delete this project?"}
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
                                        <FormHelperText>Select the team member who oversees this project.</FormHelperText>
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
                {/* <LoadTasks></LoadTasks> */}
            </div>
        );

    }

}

export default Projects;