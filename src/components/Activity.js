import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container, Typography } from '@mui/material';

const theme = createTheme();

export default function Activity() {
    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg" maxHeight="30vw">
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                        <Button sx={{ height: '100%', width: '100%'}}>
                                            <ListItem onClick={() => this.handleClick()}>
                                                <ListItemText primary={`Person commented on TASK 3`} secondary="Maybe consider changing this feature?"/>
                                            </ListItem>
                                        </Button>
                                    <Divider />   
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}