import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";





export const AccountProfile = (props) => {
  const user = apiFunctions.useFirebaseAuth();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSelf, setSelf] = useState(false)
  const [followed, setFollow] = useState(true)

  
  useEffect(() => {
    // console.log("reload");
    fetchData();
  }, []);

  const handleFollow = (event) => {
    setFollow(!followed)
  }

  const fetchData = async (event) => {
    if (user.key === id) {
      setSelf(true)
    }

    console.log("loading: " + id)
    const userTemp = (await apiFunctions.getObjectById("users", id))[0];
    console.log(JSON.stringify(userTemp))
    console.log("hello")
    setName(userTemp[1].firstName)
  }
  
  return (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={avatar}
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {name}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        color="primary"
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions>
    {isSelf ? '' :
    <div>
      <Divider />
      <CardActions><Button
        color="primary"
        fullWidth
        variant="text"
        onClick={handleFollow}
      >
        {followed ? 'Follow User' : 'Unfollow User'}
      </Button></CardActions>
    </div>}
  </Card>
  );
};
