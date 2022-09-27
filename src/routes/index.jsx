import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register"
import NavBar from '../components/NavBar';
import Projects from '../pages/Projects';

const Routing = props => {

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/home" element={<Dashboard />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/project" element={<Projects />} />
                <Route exact path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default Routing;