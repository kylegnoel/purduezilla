import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import LoadTasks from '../components/LoadTasks';
import ViewTasks from '../components/TaskDashboard';
import Activity from '../components/Activity';
import Projects from '../components/ProjectDashboard'
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import apiFunctions from '../firebase/api';
import '../App.css'


const Dashboard = () => {

    const [comments, setComments] = useState([]);
    const user = apiFunctions.useFirebaseAuth();
    useEffect(() => {
        setData();

    }, []);

    const setData = () => {
        try {
            if (user != null) {
                // console.log("ran user not null");
                // console.log(user);
                let returnedComment = apiFunctions.getTaggedComments(user.user.key);
                setComments(returnedComment);
                console.log(returnedComment);
            }
        } catch {

        }
    }

    return (
        <div>
            <NavBar></NavBar>
            <div class="flex-container">
                <div style={{ marginBottom: '-16px' }} class="flex-child">
                    <Typography
                        variant="h5"
                        maxWidth={'9em'}
                        marginBottom='-16px'
                        marginLeft='24px'
                        marginTop='24px'
                        noWrap
                        href=""
                        sx={{
                            mr: 2,
                            textAlign: 'center',
                            display: { xs: 'flex' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Tasks Feed
                    </Typography>
                </div>
                <div style={{ marginBottom: '-16px' }} class="flex-child">
                    <Typography
                        variant="h5"
                        maxWidth={'9em'}
                        marginBottom='-16px'
                        marginLeft='24px'
                        marginTop='24px'
                        noWrap
                        href=""
                        sx={{
                            mr: 2,
                            textAlign: 'center',
                            display: { xs: 'flex' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Projects Feed
                    </Typography>
                </div>
            </div>


            <div class="flex-container">
                <div class="flex-child">
                    <ViewTasks></ViewTasks>
                </div>
                <div class="flex-child">
                    <Projects></Projects>
                </div>
            </div>
            <div>
                <h1>Tagged comments display: </h1>
                <div>

                    {comments.map((comment) => (
                        < div >
                            <p>task key: {comment.taskKey}</p>
                            <p>commentKey: {comment.commenKey}</p>
                            <p>author: {comment.author}</p>
                            <p>body: {comment.body}</p>
                            <hr></hr>
                        </div>
                    ))}

                </div>
            </div>
        </div >
    );
}
// taskKey: taskKey,
//         commentKey: newCommentRef.key,
//         author: authorKey,
//         body: body

export default Dashboard;