import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const theme = createTheme();

export default function ProjectDashboard() {
    const { id } = useParams();
    const [projListarr1, setProjListArr] = useState([]);
    // const taskListarr = []

    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = apiFunctions.useFirebaseAuth();


    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addproject") {
            navigate('/project/'+event.currentTarget.id);
        }
        else {
            navigate('/newproject/');
        }
    }

    const fetchData = async () => {
        setProjListArr([])
        const projectTemp = (await apiFunctions.getUsersProjects(user.key));
        setProjListArr(projectTemp)
        
        // console.log("taskListarr: " + projListarr.length)
        return true;
    };

    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                    { projListarr1 && projListarr1.length !== 0 ? projListarr1.map((data) => {
                                            return (  
                                            <div key={data[1]}>
                                            <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%'}}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <WorkIcon color="grey"/>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={data[1].name} secondary="Content was changed"/>
                                                </ListItem>
                                            </Button>
                                            <Divider />
                                        </div>   
                                        )}): "There are no Projects!" }
                                    <Button onClick={handleTask} id={"addproject"} sx={{ height: '80%', width: '100%'}}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Add Project"}/>
                                            </ListItem>
                                        </Button>
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}