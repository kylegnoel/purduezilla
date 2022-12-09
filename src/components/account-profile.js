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
  const { id } = useParams();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    // console.log("reload");
    fetchData();
  }, []);

  const fetchData = async (event) => {
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
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {name}
          </Avatar>
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
    </Card>
  );
};
