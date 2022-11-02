import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Link, CssBaseline, Typography } from '@mui/material';
import Box from '@mui/material/Box';
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
import Input from '@mui/material/Input';
import NavBar from '../components/NavBar';
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';

import { ref, onValue } from "firebase/database";

import apiFunctions from '../firebase/api';
import { Navigate } from "react-router-dom";

const theme = createTheme();

export default function NewProject() {
    const [selectedFollower, setSelectedFollower] = React.useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [owner, setOwner] = React.useState([]);
    const [member, setMember] = React.useState([]);
    const [memberId, setMemberId] = React.useState([]);
    const [ownerId, setOwnerId] = React.useState([]);

    const [userList, setUserList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleNameChange = event => {
        setName(event.target.value)
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };


    const handleMemberChange = (event) => {
        setMember(event.target.value);
        console.log("finished");
        console.log("selected id: " + event.currentTarget.id[1]);
    };

    const handleOwnerChange = (event) => {
        setOwner(event.target.value);
        console.log("finished");
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("submitted")

        const memberId = ([]);
        const ownerId = ([]);

        member.forEach(function(memberTemp) {
            memberId.push(memberTemp[1])
        })

        owner.forEach(function(ownerTemp) {
            ownerId.push(ownerTemp[1])
        })

        console.log("member: " + memberId)
        console.log("owner: " + ownerId);

        // convert names into userid 

        let createNewGroup = await apiFunctions.createNewGroup(
            name, memberId, ownerId
            )

        const ret = createNewGroup
        if (ret) {
            console.log("FINISHED: " + ret);
            alert(name + " Group Created!");
            navigate('/group/'+ ret);
        } else {
        // perform error UI like highlighting textfield to red
            alert("invalid login\n TODO: perform error UI")
        }
    };

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {

        // user
        try {
            onValue(ref(apiFunctions.db, 'users/'), (snapshot) => {
                const userTemp = []
    
                snapshot.forEach(function(child) {
                    const user = child.val()
                    console.log(JSON.stringify(user))
                    console.log("current value: " + user.firstName + " " + user.lastName)
                    userTemp.push([user, child.key])
                })

                setUserList(userTemp)
                console.log("snapshot: " + userList.length)
            })
            if (userList.length !== 0) {
                setLoading(false)
            }
        }
        catch {
            // if there is no internet
        }
    }

    return(
        <div>
            <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xm">
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <h2 align='center' 
                        sx={{
                            marginTop:10,
                            marginBottom:-5,
                        }}>New Group</h2>
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
                                                name="groupName"
                                                onChange={handleNameChange}
                                                required
                                                fullWidth
                                                id="groupName"
                                                label="Group Name"
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
                                        id="groupDescription"
                                        label="Group Description"
                                        name="groupDescription"
                                        />
                                    </Grid>                                    
                                </Grid>

                                <br></br>
                                <Divider>OWNERS</Divider>
                                <br></br>

                                    <FormControl xs={12} fullWidth>
                                        <InputLabel id="memberLabel">Owners</InputLabel>
                                        <Select
                                            multiple
                                            defaultValue={10}
                                            value={owner}
                                            onChange={handleOwnerChange}
                                            label="ownerLabel"
                                            textOverflow="ellipsis"
                                            overflow="hidden"
                                            id="ownerLabel"
                                            renderValue={(owner) => (
                                            <div>
                                                {owner.map((data) => (
                                                  <Chip 
                                                  key={data[1]} 
                                                  avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                                  label={data[0].firstName + " " + data[0].lastName} 
                                                  sx={{marginRight:1,}}/>
                                                ))}
                                            </div>
                                            )}
                                        >
                                            { userList && userList.length != 0 ? userList.map((data) => 
                                                        <MenuItem value={data} id={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                    ): <MenuItem value={0}>New User</MenuItem> }
                                        </Select>
                                        <FormHelperText>Select the team owners of this project.</FormHelperText>
                                    </FormControl>

                                    <br></br>
                                    <br></br>
                                <Divider>MEMBERS</Divider>
                                <br></br>

                                    <FormControl xs={12} fullWidth>
                                        <InputLabel id="memberLabel">Follower</InputLabel>
                                        <Select
                                            multiple
                                            defaultValue={10}
                                            value={member}
                                            onChange={handleMemberChange}
                                            label="memberLabel"
                                            textOverflow="ellipsis"
                                            overflow="hidden"
                                            id="memberLabel"
                                            renderValue={(member) => (
                                                <div>
                                                {member.map((data) => (
                                                  <Chip 
                                                  key={data[1]} 
                                                  avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                                  label={data[0].firstName + " " + data[0].lastName} 
                                                  sx={{marginRight:1,}}/>
                                                ))}
                                                </div>
                                            )}
                                        >
                                            { userList && userList.length != 0 ? userList.map((data) => 
                                                        <MenuItem value={data} id={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
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
                                Add Project
                                </Button>
                        </Box>
                    </Container>
             </ThemeProvider>
        </div>
    );
}