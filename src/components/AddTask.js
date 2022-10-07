import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Link, CssBaseline, Typography } from '@mui/material';
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
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';

import apiFunctions from '../firebase/api';

const theme = createTheme();

export default function AddTask() {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState([]);
    const [selectedFollower, setSelectedFollower] = React.useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [assignee, setAssign] = useState('');
    const [hour, setHour] = useState('');
    const [label, setLabel] = useState('');
    const [owner, setOwner] = useState('');
    const [project, setProject] = useState('');
    

    const handleClickOpen = (event) => {
        event.preventDefault();
        setOpen(true);
    };

    const handleClose = (event) => {
        event.preventDefault();
        setOpen(false);
    };

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
    };

    const handleFollowerChange = (event) => {
        setSelectedFollower(event.target.value);
    };

    const handleNameChange = event => {
        setName(event.target.value)
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };
    
    const handleHourChange = event => {
        setHour(event.target.value)
    };

    const handleLabelChange = event => {
        setLabel(event.target.value)
    };

    const handleOwnerChange = event => {
        setOwner(event.target.value)
    };

    const handleProjectChange = event => {
        setProject(event.target.value)
    };

    const handleAssignChange = event => {
        setAssign(event.target.value)
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("submitted")

        let createNewTask = await apiFunctions.createNewTask(
            1, // projectId 
            name, // title 
            description, // description
            hour, // estimatedTime
            label, // status
            selectedFollower, // permiteedUserIds
            owner, // ownerIds
            assignee, // assignedUserIds
            selectedFollower, // followerIds
            )

        if (createNewTask) {
            
        } else {
        
            
        }
        console.log("FINISHED");
    };

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Button variant="outlined" onClick={handleClickOpen} sx={{
                            marginTop:8,
                            marginBottom:0,
                            bgcolor: 'background.paper',
                        }}>
                    New Task
                </Button>
                <Dialog open={open}  onClose={handleClose}>
                    <DialogContent>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                            <DialogTitle align='center' 
                            sx={{
                                marginTop:-4,
                                marginBottom:-5,
                            }}>New Task</DialogTitle>
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                                >                                
                                <Box component="form" sx={{ mt: 4 }}>
                                    <Grid container spacing={2}>
                                    <Grid item xs={50} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                autoComplete="given-name"
                                                name="taskName"
                                                onChange={handleNameChange}
                                                required
                                                fullWidth
                                                id="taskName"
                                                label="Task Name"
                                                autoFocus
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <FormControl xs={8} fullWidth>
                                                    <InputLabel id="assignLabel">Label</InputLabel>
                                                    <Select
                                                        multiple
                                                        defaultValue={10}
                                                        value={selected}
                                                        onChange={selectionChangeHandler}
                                                        label="Label"
                                                        id="label"
                                                        textOverflow="ellipsis"
                                                        overflow="hidden"
                                                        renderValue={(selected) => (
                                                        <div>
                                                            {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                            ))}
                                                        </div>
                                                        )}
                                                    >
                                                        <MenuItem value={'To Do'}>To Do</MenuItem>
                                                        <MenuItem value={'In Progress'}>In Progress</MenuItem>
                                                        <MenuItem value={'To Review'}>To Review</MenuItem>
                                                        <MenuItem value={'In Review'}>In Review</MenuItem>
                                                        <MenuItem value={'Complete'}>Complete</MenuItem>
                                                        <MenuItem value={'Saved'}>Saved</MenuItem>
                                                        <MenuItem value={'Closed'}>Closed</MenuItem>
                                                        <MenuItem value={"Won't Do"}>Won't Do</MenuItem>
                                                    </Select>
                                                    <FormHelperText>Select corresponding labels.</FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Input
                                                    type="number"
                                                    autoComplete="given-name"
                                                    name="estimatedHours"
                                                    required
                                                    fullWidth
                                                    onChange={handleHourChange}
                                                    id="estimatedHours"
                                                    label="Estimated Hours"
                                                    autoFocus
                                                    />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="projectLabel">Project</InputLabel>
                                            <Select
                                                labelId="projectLabel"
                                                id="projectLabel"
                                                label="Project"
                                                defaultValue={10}
                                                onChange={handleProjectChange}
                                            >
                                                <MenuItem value={10}>Project 1</MenuItem>
                                                <MenuItem value={20}>Project 2</MenuItem>
                                                <MenuItem value={30}>Project 3</MenuItem>
                                                <MenuItem value={40}>More</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        multiline
                                        onChange={handleDescChange}
                                        rows={4}
                                        id="taskDescription"
                                        label="Task Description"
                                        name="taskDescription"
                                        />
                                    </Grid>
                                    </Grid>

                                    <br></br>
                                    <Divider>OWNERSHIP</Divider>
                                    <br></br>

                                    <FormControl fullWidth>
                                            <InputLabel id="ownerLabel">Owner</InputLabel>
                                            <Select
                                                labelId="ownerLabelSelect"
                                                id="ownerSelect"
                                                label="ownerLabel"
                                                onChange={handleOwnerChange}
                                                defaultValue={10}
                                            >
                                                <MenuItem value={10}>Me (default)</MenuItem>
                                                <MenuItem value={20}>User 2</MenuItem>
                                                <MenuItem value={30}>User 3</MenuItem>
                                            </Select>
                                            <FormHelperText>Select the team member who oversees this task.</FormHelperText>
                                        </FormControl>

                                    <br></br>
                                    <br></br>
                                    <Divider>ASSIGN</Divider>
                                    <br></br>
                                    <FormControl fullWidth>
                                        <InputLabel id="assignLabel">Assignee</InputLabel>
                                        <Select
                                            labelId="assignLabelSelect"
                                            id="assignSelect"
                                            label="assignLabel"
                                            defaultValue={10}
                                        >
                                            <MenuItem value={10}>Me (default)</MenuItem>
                                            <MenuItem value={20}>User 2</MenuItem>
                                            <MenuItem value={30}>User 3</MenuItem>
                                        </Select>
                                        <FormHelperText>Select the team member who is assigned to this task.</FormHelperText>
                                    </FormControl>

                                    <br></br>
                                    <br></br>
                                    <Divider>FOLLOWERS</Divider>
                                    <br></br>

                                    <FormControl xs={12} fullWidth>
                                        <InputLabel id="followerLabel">Follower</InputLabel>
                                        <Select
                                            multiple
                                            defaultValue={10}
                                            value={selectedFollower}
                                            onChange={handleFollowerChange}
                                            label="followerLabel"
                                            textOverflow="ellipsis"
                                            overflow="hidden"
                                            id="followerSelect"
                                            renderValue={(selected) => (
                                            <div>
                                                {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                                ))}
                                            </div>
                                            )}
                                        >
                                            <MenuItem value={"Me"}>Me (default)</MenuItem>
                                            <MenuItem value={"User 2"}>User 2</MenuItem>
                                            <MenuItem value={"User 3"}>User 3</MenuItem>
                                        </Select>
                                        <FormHelperText>Select the team members to follow this task..</FormHelperText>
                                    </FormControl>
                                </Box>
                                </Box>
                                <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        >
                                    Add Task
                                    </Button>
                            </Box>
                        </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
            </Container>
     </ThemeProvider>
    );
}