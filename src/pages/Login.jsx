import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import apiFunctions from '../firebase/api';

const Login = () => {
    const signIn = () => {
        apiFunctions.signInAccount("tester@gmail.com", "192837465");
    }
    const signOut = () => {
        apiFunctions.signOutAccount();
    }
    const createAccount = () => {
        apiFunctions.createAccount("tester@gmail.com", "192837465");
    }

    return (
        <div>
            <NavBar></NavBar>
            <button onClick={signIn}> Sign In</button>
            <button onClick={signOut}> Sign out</button>
            <button onClick={createAccount}> Create Account</button>
        </div>
    );
}



export default Login;