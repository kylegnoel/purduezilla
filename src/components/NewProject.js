import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// material ui imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from "@mui/material/Avatar";

//db imports 
import { ref, onValue } from "firebase/database";
import apiFunctions from '../firebase/api';

const theme = createTheme();

export default function NewProject() {
    const {id} = useParams();

    const [selectedFollower, setSelectedFollower] = React.useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [memberId, setMemberId] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [status, setStatus] = React.useState([]);
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [group, setGroup] = useState(id);
    const navigate = useNavigate();

    const handleNameChange = event => {
        setName(event.target.value)
    };

    const selectionChangeHandler = (event) => {
        setSelected(event.target.value);
        // console.log("finished");
        // console.log("selected id: " + event.currentTarget.id[1]);
    };

    const statusChangeHandler = (event) => {
        setStatus(event.target.value);
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };

    const handleOwnerChange = event => {
        // console.log(event.target.value)
        setOwner(event.target.value)
    };

    const handleGroupChange = async(event) => {
        if (event.target.value != undefined) {
            const userListTemp = (await apiFunctions.getGroupsMembers("", id))
            setUserList(userListTemp)
        }
        setGroup(event.target.value)
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        // console.log("submitted")
        // console.log(memberId)

        // convert member names into userid 
        var memberId = ([]);

        selected.forEach(function(member) {
            console.log("adding new member: " + member[0])
            memberId.push(member[0])
        })

        console.log("members: " + memberId)
        console.log("group: " + group)

        let createNewProject = await apiFunctions.createNewProject(
            name, description, group, memberId, owner[0])

        if (createNewProject) {
            navigate('/myprojects')
        } else {
        // perform error UI like highlighting textfield to red
            alert("Project Creation Failed.\nPlease try again.")
        }
        // console.log("FINISHED");
        alert("Project Added");
    };

    useEffect(() => {
        // console.log("reload")
        fetchData()
    }, []);

    const fetchData = async (event) => {
        if (id !== undefined) {
            console.log("not defined")
            const userListTemp = (await apiFunctions.getGroupsMembers("", id))
            console.log("returned: " + JSON.stringify(userListTemp))
            setUserList(userListTemp)
        } else {
            // users
            const userTemp = (await apiFunctions.getObjectById("users",""))
            console.log("userTemp: " + JSON.stringify(userTemp))
            setUserList(userTemp)
        }

        // projects
        const groupTemp = (await apiFunctions.getObjectById("groups", ""))
        console.log("groupTemp: " + JSON.stringify(groupTemp))
        setGroupList(groupTemp)
    }

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
            <Box component="form"  onSubmit={handleSubmit} Validate sx={{ mt: 3 }}>
                <h2><DialogTitle align='center' 
                sx={{
                    marginTop:-4,
                    marginBottom:-5,
                }}><h2>New Project</h2></DialogTitle></h2>
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
                                id="projectDescription"
                                label="Project Description"
                                name="projectDescription"
                                />
                            </Grid>
                        </Grid>
                        <br></br>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="groupLabel">Group</InputLabel>
                                <Select
                                    labelId="groupLabel"
                                    id="groupLabel"
                                    label="Group"
                                    required
                                    defaultValue={id}
                                    onChange={handleGroupChange}
                                >
                                    { groupList && groupList.length != 0 ? groupList.map((data) => 
                                        <MenuItem value={data[0]}>{data[1].name}</MenuItem>
                                    ): <MenuItem value={0}>New Project</MenuItem> }
                                </Select>
                            </FormControl>
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
                                required
                                onChange={handleOwnerChange}
                                defaultValue={10}
                            >
                                { userList && userList.length != 0 ? userList.map((data) => 
                                                <MenuItem value={data} id={data}>{data[1].firstName + " " + data[1].lastName}</MenuItem>
                                            ): <MenuItem value={0}>New User</MenuItem> }
                            </Select>
                            <FormHelperText>Select the team member who oversees this project.</FormHelperText>
                        </FormControl>

                            <br></br>
                        <Divider>MEMBERS</Divider>
                        <br></br>

                            <FormControl xs={12} fullWidth>
                                <InputLabel id="memberLabel">Members</InputLabel>
                                <Select
                                    multiple
                                    defaultValue={10}
                                    required
                                    value={selected}
                                    onChange={selectionChangeHandler}
                                    label="memberLabel"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    id="memberLabel"
                                    renderValue={(selected) => (
                                    <div>
                                        {selected.map((data) => (
                                        <Chip 
                                        key={data} 
                                        avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[1].firstName[0]}</Avatar>}
                                        label={data[1].firstName + " " + data[1].lastName} 
                                        sx={{marginRight:1,}}/>
                                        ))}
                                    </div>
                                    )}
                                >
                                    { userList && userList.length != 0 ? userList.map((data) => 
                                                <MenuItem value={data}>{data[1].firstName + " " + data[1].lastName}</MenuItem>
                                            ): <MenuItem value={0}>New User</MenuItem> }
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
                        Create Project
                        </Button>
                </Box>
            </Container>
     </ThemeProvider>
    );
}