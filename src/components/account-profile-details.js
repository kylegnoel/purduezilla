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
  const [isLoading, setLoading] = useState(true);

  
  const [values, setValues] = useState({
    name: 'Example name',
    email: 'Example email',
    description: 'Example description'
    
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const fetchData = (event) => {
    console.log("hello")
    // Update the document title using the browser API
    // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
    // console.log("response: " + response)
    try {
        onValue(ref(apiFunctions.db, 'users/'), (snapshot) => {
                const taskTemp = []
    
                snapshot.forEach(function(child) {
                    const retrievedUser = snapshot.val();
                    values.push(retrievedUser.name)
                    taskTemp.push(child.val())
                })
  
        })
        
  
    }
    catch {
        // if there is no internet
    }
    
  
    return true;
  };

  useEffect(() => {
    console.log("reload")
    fetchData()
}, []);

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
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};