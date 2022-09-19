import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

const Routing = props => {

    return (
        <Router>
            <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/home" element={<Dashboard />} />
                <Route exact path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default Routing;