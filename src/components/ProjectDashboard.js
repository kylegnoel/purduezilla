import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Container, Typography } from '@mui/material';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const theme = createTheme();

export default function ProjectDashboard() {
    const [projListarr, setProjListArr] = useState([]);
    // const taskListarr = []
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {
        console.log("hello")
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        try {
            onValue(ref(apiFunctions.db, 'projects/'), (snapshot) => {
                    const projectTemp = []
        
                    snapshot.forEach(function(child) {
                        const project = child.val()
                        projectTemp.push(child.val())
                    })

                    setProjListArr(projectTemp)
                    console.log("snapshot: " + setProjListArr.length + " " +  projectTemp.length)
            })
            if (setProjListArr.length !== 0) {
                setLoading(false)
            }

        }
        catch {
            // if there is no internet
        }

        setLoading(false)
        
        console.log("taskListarr: " + projListarr.length)
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
                                    { projListarr && projListarr.length != 0 ? projListarr.map((data) => {
                                            return (
                                            <div key={data.projectId}>
                                            <Button sx={{ height: '100%', width: '100%'}}>
                                                <ListItem onClick={() => this.handleClick()}>
                                                    <ListItemAvatar>
                                                        <WorkIcon color="grey"/>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={data.name}/>
                                                </ListItem>
                                            </Button>
                                            <Divider />
                                        </div>   
                                        )}): "There are no Projects!" }
        
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}