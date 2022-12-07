import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// material ui imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import TaskIcon from '@mui/icons-material/Task';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container } from '@mui/material';

// db imports
import apiFunctions from '../firebase/api';

const theme = createTheme();

export default function HistoryDashboard() {
    const [taskListarr, setTaskListArr] = useState([]);
    const [task, setTask] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [history, setHistoryEvents] = useState([]);
    const user = apiFunctions.useFirebaseAuth();

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            navigate('/' + event.currentTarget.id);
        }
    }


    const fetchData = async () => {
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        setHistoryEvents([])
        const historyTemp = (await apiFunctions.getHistoryEvents(user.key));
        const userList = [];
        const finalHistory = [];

        console.log("returned: " + historyTemp)

        setHistoryEvents(historyTemp)

        console.log("resulting value: " + JSON.stringify(historyTemp[2]))

        return true;
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <Box sx={{ mt: 6 }} display="flex" style={{ textAlign: "center" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={50} sm={12} lg={'50%'}>
                            <FixedSizeList sx={{
                                border: 1, borderColor: 'black', maxHeight: 600, overflowY: 'auto', flexGrow: 1,
                                flexDirection: "column",
                            }} height={400}>
                                {history && history.length !== 0 ? history.map((data) => {
                                    return (
                                        <div key={data[0]}>
                                            <Button onClick={handleTask} id={data[0]} sx={{ height: '100%', width: '100%' }}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <TaskIcon color="grey" />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={data[1]} secondary={data[1] + " was changed on " + data[1]} />
                                                </ListItem>
                                            </Button>
                                            <Divider />
                                        </div>
                                    )
                                }) : "There hasn't been any edits!"}
                            </FixedSizeList>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>

    );
}