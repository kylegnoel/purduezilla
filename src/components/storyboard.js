import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography } from '@mui/material';
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
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FixedSizeList from '@mui/material/List';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProjectDashboard from '../components/ProjectDashboard';
import { Route, Link, Routes, useParams } from 'react-router-dom';


import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 6px;
  background: #d4d4d4;
  min-height: 600px;
`;

const DragItem = styled.div`
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: white;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
`;

const tallGrid = {
    height: '100%'
}


export default function SimpleCard() {
    const { id } = useParams();

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [project, setProject] = useState('');
    const [description, setDesc] = useState('');
    const navigate = useNavigate();

    const [toDo, setToDo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [inTesting, setInTesting] = useState([]);
    const [completed, setCompleted] = useState([]);


    const handleClickOpen = () => {

    };

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = (event) => {
        setTaskListArr([])
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        if (id === undefined) {

        }
        else {
            try {
                onValue(ref(apiFunctions.db, 'tasks/'), (snapshot) => {
                    const todoTemp = []
                    const inprogressTemp = []
                    const intestingTemp = []
                    const completedTemp = []

                    snapshot.forEach(function (child) {
                        const task = child.val()
                        if (task.status === "To Do") {
                            todoTemp.push([task, child.key])
                        }
                        else if (task.status === "In Progress") {
                            inprogressTemp.push([task, child.key])
                        }
                        else if (task.status === "In Testing") {
                            intestingTemp.push([task, child.key])
                        }
                        else if (task.status === "Completed") {
                            completedTemp.push([task, child.key])
                        }
                    })

                    setToDo(todoTemp)
                    setInProgress(inprogressTemp)
                    setInTesting(intestingTemp)
                    setCompleted(completedTemp)
                })

                // set project name
                onValue(ref(apiFunctions.db, "projects/" + id), (snapshot) => {
                    setProject(snapshot.val().name)
                    setDesc(snapshot.val().description)
                });

                if (taskListarr.length !== 0) {
                    setLoading(false)
                }
            }
            catch {
                // if there is no internet
            }
        }

        setLoading(false)
        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            navigate('/task/' + event.currentTarget.id);
        }
        else {
            navigate('/newtask/' + id);
        }
    }



    const onDragEnd = (result) => {
        //console.log(result);
        if (!result.destination) {
            return;
        } else {
            const index = result.draggableId % 100;
            var newStatus = "";

            //Finds out which column the task is moving to
            if (result.destination.droppableId == "toDo") {
                newStatus = "To Do";
            } else if (result.destination.droppableId == "inProgress") {
                newStatus = "In Progress"
            } else if (result.destination.droppableId == "inTesting") {
                newStatus = "In Testing"
            } else if (result.destination.droppableId == "completed") {
                newStatus = "Completed";
            }

            //console.log(index);

            var task;

            switch (result.source.droppableId) {
                case "inProgress":
                    task = inProgress[index][0];
                    apiFunctions.updateTaskDetails(inProgress[index][1], task.name, task.description, task.status, task.name, task.description, newStatus);
                    break;
                case "toDo":
                    task = toDo[index][0];
                    apiFunctions.updateTaskDetails(toDo[index][1], task.projectId[index][0], task.name, task.description, task.estimatedTime, newStatus);
                    break;
                case "completed":
                    task = completed[index][0];
                    apiFunctions.updateTaskDetails(completed[index][1], task.projectId[index][0], task.name, task.description, task.estimatedTime, newStatus);
                    break;
                case "inTesting":
                    task = inTesting[index][0];
                    apiFunctions.updateTaskDetails(inTesting[index][1], task.projectId[index][0], task.name, task.description, task.estimatedTime, newStatus);
                    break;
            }
        }

    }

    if (id === undefined) {
        return (
            <div>
                <br></br>
                <h2>My Projects</h2>
                <ProjectDashboard></ProjectDashboard>
            </div>
        );
    }
    else {
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <br></br>
                        <h2>{project}</h2>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                                <Grid container spacing={2} direction="row" alignItems="stretch" >
                                    <Grid item sm={3}>
                                        <Typography><h3>To Do</h3></Typography>
                                        <Divider></Divider>
                                    </Grid>

                                    <Grid item sm={3}>
                                        <Typography><h3>In Progress</h3></Typography>
                                        <Divider></Divider>
                                    </Grid>

                                    <Grid item sm={3}>
                                        <Typography><h3>In Testing</h3></Typography>
                                        <Divider></Divider>
                                    </Grid>

                                    <Divider></Divider>
                                    <Grid item sm={3}>
                                        <Typography><h3>Completed</h3></Typography>
                                        <Divider></Divider>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                                <Grid container spacing={2} direction="row" alignItems="stretch" >
                                    <Grid item sm={3}>
                                        <DroppableStyles>
                                            <Droppable droppableId="toDo">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {toDo && toDo.map((item, index) => {
                                                            return (
                                                                <Draggable draggableId={(index).toString()} key={item[1]} index={(index)}>
                                                                    {(provided, snapshot) => (
                                                                        <DragItem
                                                                            ref={provided.innerRef}
                                                                            snapshot={snapshot}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <ListItem id={(index)} onClick={handleTask}>
                                                                                <ListItemText primary={item[0].name} secondary={item[0].description} />
                                                                            </ListItem>
                                                                        </DragItem>

                                                                    )}

                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DroppableStyles>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <DroppableStyles>
                                            <Droppable droppableId="inProgress">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {inProgress && inProgress.map((item, index) => {
                                                            return (
                                                                <Draggable draggableId={(100 + index).toString()} key={item[1]} index={(100 + index)}>
                                                                    {(provided, snapshot) => (
                                                                        <DragItem
                                                                            ref={provided.innerRef}
                                                                            snapshot={snapshot}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <ListItem id={(100 + index)} onClick={handleTask}>
                                                                                <ListItemText primary={item[0].name} secondary={item[0].description} />
                                                                            </ListItem>
                                                                        </DragItem>

                                                                    )}

                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DroppableStyles>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <DroppableStyles>
                                            <Droppable droppableId="inTesting">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {inTesting && inTesting.map((item, index) => {
                                                            return (
                                                                <Draggable draggableId={(200 + index).toString()} key={item[1]} index={(200 + index)}>
                                                                    {(provided, snapshot) => (
                                                                        <DragItem
                                                                            ref={provided.innerRef}
                                                                            snapshot={snapshot}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <ListItem id={(200 + index)} onClick={handleTask}>
                                                                                <ListItemText primary={item[0].name} secondary={item[0].description} />
                                                                            </ListItem>
                                                                        </DragItem>

                                                                    )}

                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DroppableStyles>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <DroppableStyles>
                                            <Droppable droppableId="completed">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {completed && completed.map((item, index) => {
                                                            return (
                                                                <Draggable draggableId={(300 + index).toString()} key={item[1]} index={(300 + index)}>
                                                                    {(provided, snapshot) => (
                                                                        <DragItem
                                                                            ref={provided.innerRef}
                                                                            snapshot={snapshot}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <ListItem id={(300 + index)} onClick={handleTask}>
                                                                                <ListItemText primary={item[0].name} secondary={item[0].description} />
                                                                            </ListItem>
                                                                        </DragItem>

                                                                    )}

                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DroppableStyles>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DragDropContext>
                    </Container>
                </ThemeProvider>
                {/* <LoadTasks></LoadTasks> */}
            </div >
        );

    }
}
