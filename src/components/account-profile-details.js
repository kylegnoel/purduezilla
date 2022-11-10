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
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FixedSizeList from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import GroupIcon from '@mui/icons-material/Group';
import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";


export const AccountProfileDetails = (props) => {
  const user = apiFunctions.useFirebaseAuth();
  const [groupList, setGroupList] = useState([]);
  const [values, setValues] = useState({
    name: user.info.firstName,
    email: user.info.email,
    description: user.info.profileDescription
  }); 

  useEffect(() => {
    console.log("reload")
    fetchData()
}, []);

const handleTask = (event) => {
  if (event.currentTarget.id === "addgroup") {
      window.location.href='/newgroup/';
  }
  if (event.currentTarget.id === "addproject") {
      window.location.href='/newproject/';
  }
  else {
      console.log("eventid: " + event.currentTarget.id)
      window.location.href='/group/'+event.currentTarget.id;
  }
}

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const update = (event) => {
    //console.log(user.key + user.info.email + user.info.firstName + user.info.profileDescription + user.info.notificationSetting)
    apiFunctions.updateUser(user.key, user.info.email, values.name, "", values.description, user.info.notificationSetting)
  };

  const fetchData = () => {
    try {
        onValue(ref(apiFunctions.db, 'groups/'), (snapshot) => {
            const groupTemp = []

            snapshot.forEach(function(child) {
                console.log("group name: " + child.val().name)
                groupTemp.push([child.val(), child.key])
            })

            setGroupList(groupTemp)
        })

    }
    catch {
        // if there is no internet
    }

    return true;
};


  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          title="Profile information"
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
        <CardHeader
          title="Groups"
        />
        <FixedSizeList sx={{maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                        { groupList && groupList.length !== 0 ? groupList.map((data) => {
                                            return (
                                            <div key={data[1]}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                <ListItemAvatar>
                                                            <GroupIcon color="grey"/>
                                                        </ListItemAvatar>
                                                    <ListItem>
                                                        <ListItemText primary={data[0].name}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                        )}): "You aren't in any groups!" }
                                </FixedSizeList>
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
            onClick={update}
          >
            Save details
          </Button>
        </Box>
      </Card>
      
    </form>
  );
};