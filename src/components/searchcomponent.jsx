import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import SearchBar from "material-ui-search-bar";
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

    }

    const swapTarget = (newTarget) => {
        setTarget(newTarget);
    }

    const onSearch = () => {
        setFilterParam(searchParam);
    }


    return (
        <div>
            <SearchBar value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
            <Button onClick={onSearch}>Search</Button>

        </div>
    )

}


export default SearchComponent;
