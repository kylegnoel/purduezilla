import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register"
import Profile from "../pages/Profile";
import NavBar from '../components/NavBar';
import Projects from '../pages/Projects';
import PrivateRoute from './PrivateRoute';
import apiFunctions from '../firebase/api';
import NewProject from '../pages/NewProject';
import Task from '../pages/Task';
import AddTaskPage from '../pages/AddTaskPage';
import AddProjectPage from '../pages/AddTaskPage';
import NewGroup from '../pages/NewGroup';
import Groups from '../pages/Groups';

const Routing = props => {
    const isLoggedIn = apiFunctions.useFirebaseAuth();
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/home" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><Dashboard /></PrivateRoute>} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/myprojects" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><Projects /></PrivateRoute>} />
                <Route exact path="/newproject" element={<NewProject />} />
                <Route exact path="/profile/:id" element={<Profile />} />
                <Route exact path="/newgroup" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><NewGroup /></PrivateRoute>} />
                <Route exact path="/group/:id" element={<Groups />} />
                <Route exact path="/mygroups" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><Groups /></PrivateRoute>} />
                <Route exact path="*" element={<NotFound />} />
                <Route exact path="/project/:id" forceRefresh={true} element={<Projects />} />
                <Route exact path="/task/:id" element={<Task />} />
                <Route exact path="/newtask" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><AddTaskPage /></PrivateRoute>} />
                <Route exact path="/mytasks" element={<PrivateRoute condition={isLoggedIn} redirectRoute="/" ><Task /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default Routing;