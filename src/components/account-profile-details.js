import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDesc] = useState('');

  const [viewOnly, setViewOnly] = useState(0);

  const { id } = useParams();

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

  const handleNameChange = (event) => {
    setName(event.currentTarget.value)
  };

  const handleEmailChange = (event) => {
    setEmail(event.currentTarget.value)
  };

  const handleDescChange = (event) => {
    setDesc(event.currentTarget.value)
  };

  const update = (event) => {
    //console.log(user.key + user.info.email + user.info.firstName + user.info.profileDescription + user.info.notificationSetting)
    apiFunctions.updateUser(user.key, user.info.email, name, "", description, user.info.notificationSetting)
  };

  const fetchData = async() => {
    const userTemp = (await apiFunctions.getObjectById("users", id))[0];
    setName(userTemp[1].firstName)
    setEmail(userTemp[1].email)
    setDesc(userTemp[1].description)

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

    if (user.key !== id) {
      setViewOnly(1);
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
                onChange={handleNameChange}
                required
                disabled={viewOnly}
                value={name}
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
                onChange={handleEmailChange}
                required
                disabled={true}
                value={email}
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
                onChange={handleDescChange}
                required
                disabled={viewOnly}
                value={description}
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
           {!viewOnly && <Button
            color="primary"
            variant="contained"
            onClick={update}
          >
            Save details
          </Button>
          }
          
        </Box>
      </Card>
      
    </form>
  );
};