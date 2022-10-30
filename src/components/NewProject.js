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

export default function NewProject() {
    const [selectedFollower, setSelectedFollower] = React.useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [selected, setSelected] = React.useState([]);
    const [status, setStatus] = React.useState([]);


    const handleNameChange = event => {
        setName(event.target.value)
    };

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
    };

    const statusChangeHandler = (event) => {
        setStatus(event.target.value);
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };

    const handleOwnerChange = event => {
        setOwner(event.target.value)
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("submitted")

        let createNewProject = await apiFunctions.createNewProject(
            name, description, selected, selected, owner
            )

        if (createNewProject) {
            
        } else {
        // perform error UI like highlighting textfield to red
            alert("invalid login\n TODO: perform error UI")
        }
        console.log("FINISHED");
        alert("Project Added");
    };

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xm">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <h2 align='center' 
                sx={{
                    marginTop:10,
                    marginBottom:-5,
                }}>New Project</h2>
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
                                        name="projectName"
                                        onChange={handleNameChange}
                                        required
                                        fullWidth
                                        id="projectName"
                                        label="Project Name"
                                        autoFocus
                                        />
                                    </Grid>
                                </Grid>
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
                            <Grid item xs={12}>
                            <FormControl xs={8} fullWidth>
                                <InputLabel id="assignLabel">Status</InputLabel>
                                <Select
                                    multiple
                                    defaultValue={10}
                                    value={status}
                                    onChange={statusChangeHandler}
                                    label="Status"
                                    id="status"
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
                                <FormHelperText>Select corresponding status.</FormHelperText>
                            </FormControl>
                            </Grid>
                        </Grid>

                        <br></br>
                        <Divider>OWNERS</Divider>
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
                        <Divider>MEMBERS</Divider>
                        <br></br>

                            <FormControl xs={12} fullWidth>
                                <InputLabel id="memberLabel">Follower</InputLabel>
                                <Select
                                    multiple
                                    defaultValue={10}
                                    value={selected}
                                    onChange={selectionChangeHandler}
                                    label="memberLabel"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    id="memberLabel"
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
                                <FormHelperText>Select the team members of this project.</FormHelperText>
                            </FormControl>
                        </Box>
                    </Box>
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            >
                        Add Project
                        </Button>
                </Box>
            </Container>
     </ThemeProvider>
    );
}