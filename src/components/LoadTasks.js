import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/box';
import Grid from '@mui/material/grid';
import Button from '@mui/material/button';
import Divider from '@mui/material/divider';
import { Container } from '@mui/material';

const theme = createTheme();

export default function LoadTasks() {
    const [state, setState] = React.useState({
        checkedA: true,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleClick = () => {
        console.log("Expanding Task");
    };

    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                <List sx={{ width: '80%', 
                                            bgcolor: 'background.paper',
                                            marginTop:-2,
                                            marginBottom:-2,
                                            padding:0,
                                            maxHeight: '100%',
                                            overflow: 'auto'
                                        }}>
                                    <ListItem onClick={() => this.handleClick()}>
                                        <ListItemAvatar>
                                            <WorkIcon/>
                                        </ListItemAvatar>
                                        <ListItemText primary="Task" secondary="Task Owner"/>
                                        <Button
                                        sx={{
                                            marginTop:-2,
                                            marginBottom:-2,
                                        }}><h1>+</h1></Button>
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={50} sm={12}>
                                <List sx={{ width: '80%', bgcolor: 'background.paper', maxHeight: '100%', overflow: 'auto' }}>
                                    <ListItem onClick={() => this.handleClick()}>
                                        <ListItemAvatar>
                                            <WorkIcon color="grey"/>
                                        </ListItemAvatar>
                                        <ListItemText primary="Task" secondary="Task Owner"/>
                                        <Button
                                        sx={{
                                            marginTop:-2,
                                            marginBottom:-2,
                                        }}><h1>+</h1></Button>
                                    </ListItem>
                                    <Divider />
                                    <ListItem onClick={() => this.handleClick()}>
                                        <ListItemAvatar>
                                            <WorkIcon/>
                                        </ListItemAvatar>
                                        <ListItemText primary="Task" secondary="Task Owner"/>
                                        <Button
                                        sx={{
                                            marginTop:-2,
                                            marginBottom:-2,
                                        }}><h1>+</h1></Button>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}