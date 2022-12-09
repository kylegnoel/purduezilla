import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme();

const ResetPasswordEmailSentConfirmation = () => {
    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Typography>Password reset email has been sent, you will receive an email if you have an account with us. You may close this window now.</Typography>
        </Container>
        </ThemeProvider>
    );
}



export default ResetPasswordEmailSentConfirmation;