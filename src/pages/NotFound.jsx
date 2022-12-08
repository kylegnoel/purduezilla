import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import apiFunctions from '../firebase/api';
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const user = apiFunctions.useFirebaseAuth();
    const navigate = useNavigate();

    const fetchData = (event) => {
    }

    useEffect(() => {
        //console.log("reload")
        fetchData()
    }, []);
    
    return(
        <div>
            <NavBar></NavBar>
            Nothing at this URL!
        </div>
    );
}

export default NotFound;