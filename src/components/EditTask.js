import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Link, CssBaseline, Typography } from '@mui/material';
import Box from '@mui/material/box';
import Divider from '@mui/material/divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/grid';
import Button from '@mui/material/button';


const theme = createTheme();

export default function EditTask() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);

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
                    <DialogContent component="form" onSubmit={handleSubmit}>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <DialogTitle align='center' 
                            sx={{
                                marginTop:0,
                                marginBottom:-2,
                            }}>New Task</DialogTitle>
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
                                    Add Task
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