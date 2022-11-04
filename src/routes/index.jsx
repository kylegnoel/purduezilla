import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register"
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
import Storyboard from '../pages/Storyboard';

const Routing = props => {
    const isLoggedIn = apiFunctions.auth.currentUser != null;
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/home" element={<PrivateRoute condition={isLoggedIn != null} redirectRoute="/" ><Dashboard /></PrivateRoute>} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/myprojects" element={<Projects />} />
                <Route exact path="/newproject" element={<NewProject />} />
                <Route exact path="/newgroup" element={<NewGroup />} />
                <Route exact path="/group/:id" element={<Groups />} />
                <Route exact path="/mygroups" element={<Groups />} />
                <Route exact path="*" element={<NotFound />} />
                <Route exact path="/project/:id" forceRefresh={true} element={<Projects />} />
                <Route exact path="/project/:id/storyboard" forceRefresh={true} element={<Storyboard />} />
                <Route exact path="/task/:id" element={<PrivateRoute condition={isLoggedIn != null} redirectRoute="/" ><Task /></PrivateRoute>} />
                <Route exact path="/newtask" element={<AddTaskPage />} />
                <Route exact path="/mytasks" element={<Task />} />
                <Route exact path="/project/storyboard/:id" element={<Storyboard />} />
            </Routes>
        </Router>
    );
}

export default Routing;