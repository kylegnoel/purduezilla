import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import apiFunctions from '../firebase/api';

const SearchComponent = () => {
    const [target, setTarget] = React.useState("Task");
    const [searchParam, setSearchParam] = React.useState("");
    const [filterParam, setFilterParam] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [projects, setProjects] = React.useState([]);
    useEffect(() => {
        fetchData();
    }, []);
    const navigate = useNavigate();

    const fetchData = () => {
        setUsers(apiFunctions.getAllAccounts);
        setProjects(apiFunctions.getAllProjects);
        setTasks(apiFunctions.getAllTasks);
    }

    const swapTarget = (newTarget) => {
        setTarget(newTarget);

    }

    const onSearch = () => {
        setFilterParam(searchParam);
    }


    return (
        <div>
            <TextField value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
            <Button onClick={onSearch}>Search</Button>
            <br></br>
            <Button onClick={() => { swapTarget("Task") }}>Tasks</Button>
            <Button onClick={() => { swapTarget("Project") }}>Projects</Button>
            <Button onClick={() => { swapTarget("User") }}>Users</Button>
            {target == "Task" &&
                <div>
                    {tasks.map((task) => (
                        <div>
                            {
                                task[0].name.toLowerCase().includes(filterParam) &&
                                < Box >
                                    <Button onClick={() => { navigate(`/task/${task[1]}`) }}> {task[0].name}</Button>
                                    <p>{task[0].description}</p>
                                </Box>
                            }
                        </div>
                    ))}

                </div>
            }
            {
                target == "Project" &&
                <div>
                    {projects.map((project) => (
                        <div>
                            {
                                project[0].name.toLowerCase().includes(filterParam) &&
                                < Box >
                                    <Button onClick={() => { navigate(`/project/${project[1]}`) }}>{project[0].name}</Button>
                                    <p>{project[0].description}</p>
                                </Box>
                            }
                        </div>
                    ))}
                </div>
            }
            {
                target == "User" &&
                <div>
                    {users.map((user) => (
                        <div>
                            {
                                user[0].email.toLowerCase().includes(filterParam) &&
                                < Box >
                                    <Button onClick={() => { navigate(`/profile/${user[1]}`) }}>{user[0].email}</Button>
                                    <p>{user[0].firstName} {user[0].lastName}</p>
                                </Box>
                            }
                        </div>
                    ))}
                </div>
            }
        </div >
    )

}


export default SearchComponent;
