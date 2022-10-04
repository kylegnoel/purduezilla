import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container, Typography } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';

const theme = createTheme();

export default function LoadTasks() {
    const [state, setState] = React.useState({
        checkedA: true,
    });

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleClick = () => {
        console.log("Expanding Task");
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          email: data.get('taskName'),
          password: data.get('label'),
          project: data.get('projectLabel'),
          description: data.get('taskDescription'),
          owner: data.get('ownerSelect'),
          assign: data.get('assignSelect'),
        });
      };

    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                    <ListSubheader>Project 1</ListSubheader>
                                    {[1,2,3,4,5,6,7,8,9,10].map((value) => (
                                        <div>
                                            <Button onClick={handleClickOpen} sx={{ height: '100%', width: '100%'}}>
                                                <ListItem onClick={() => this.handleClick()}>
                                                    <ListItemAvatar>
                                                        <WorkIcon color="grey"/>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`Task ${value}`} secondary="Task Owner"/>
                                                    <Button
                                                    sx={{
                                                        marginTop:-2,
                                                        marginBottom:-2,
                                                    }}><h1>+</h1></Button>
                                                </ListItem>
                                            </Button>
                                            <Divider />
                                        </div>
                                    ))}
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>

                    <Dialog open={open}  onClose={handleClose}>
                    <DialogContent component="form" onSubmit={handleSubmit}>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <DialogTitle align='center' 
                            sx={{
                                marginTop:0,
                                marginBottom:-2,
                            }}>Edit Task</DialogTitle>
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                                >
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>
                                    <Grid container spacing={2}>
                                    <Grid item xs={50} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                autoComplete="given-name"
                                                name="taskName"
                                                required
                                                fullWidth
                                                id="taskName"
                                                label="Task Name"
                                                autoFocus
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                autoComplete="given-name"
                                                name="label"
                                                required
                                                fullWidth
                                                id="label"
                                                label="Labels"
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
                                                label="Owner"
                                                defaultValue={10}
                                            >
                                                <MenuItem value={10}>Me (default)</MenuItem>
                                                <MenuItem value={20}>User 2</MenuItem>
                                                <MenuItem value={30}>User 3</MenuItem>
                                            </Select>
                                        </FormControl>

                                    <br></br>
                                    <br></br>
                                    <Divider>ASSIGN</Divider>
                                    <br></br>
                                    <FormControl fullWidth>
                                        <InputLabel id="assignLabel">Owner</InputLabel>
                                        <Select
                                            labelId="assignLabelSelect"
                                            id="assignSelect"
                                            label="Assign"
                                            defaultValue={10}
                                        >
                                            <MenuItem value={10}>Me (default)</MenuItem>
                                            <MenuItem value={20}>User 2</MenuItem>
                                            <MenuItem value={30}>User 3</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        >
                                    Save Changes
                                    </Button>
                                </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
                </Container>
            </ThemeProvider>
        
    );
}