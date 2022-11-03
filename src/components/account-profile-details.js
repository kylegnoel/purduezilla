import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";





export const AccountProfileDetails = (props) => {
  const user = apiFunctions.useFirebaseAuth();

  console.log('USER: ');
  console.log(user.info.email);

  
  const [values, setValues] = useState({
    name: user.info.firstName,
    email: user.info.email,
    description: user.info.profileDescription
  }); 

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const myFunction = (event) => {
    //console.log(user.key + user.info.email + user.info.firstName + user.info.profileDescription + user.info.notificationSetting)
    apiFunctions.updateUser(user.key, user.info.email, values.name, "", values.description, user.info.notificationSetting)
  };


  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify your name"
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                disabled={true}
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                required
                value={values.description}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={myFunction}
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};