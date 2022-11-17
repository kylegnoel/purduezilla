import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// db imports
import apiFunctions from "../firebase/api";

const PrivateRoute = props => {

    if (!apiFunctions.useFirebaseAuth()) 
        return (<Navigate to={props.redirectRoute} />);
    return (props.children);

}

PrivateRoute.propTypes = {
    condition: PropTypes.bool,
    redirectRoute: PropTypes.string,
}


export default PrivateRoute;