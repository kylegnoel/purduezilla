import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

import TextField from '@mui/material';
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

    const fetchData = () => {
        setUsers(apiFunctions.getAllAccounts);
        setProjects(apiFunctions.getAllProjects);
        setTasks(apiFunctions.getAllTasks);
    }

    const swapTarget = (newTarget) => {
        setTarget(newTarget);

        console.log(users);
        console.log(tasks);
        console.log(projects);
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

        </div>
    )

}


export default SearchComponent;
