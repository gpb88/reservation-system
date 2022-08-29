import * as React from 'react';
import {
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Typography,
    Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from 'services/handleLogin';
import { GoogleLogin } from '@react-oauth/google';
import { OAuth2Client } from 'google-auth-library';
import { useSnackbar } from 'notistack';

export default function Login() {
    let [rememberMe, setRememberMe] = React.useState(false);

    let navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    async function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const loginUser = {
            username: data.get('username'),
            password: data.get('password'),
        };

        let authenticated = await handleLogin(loginUser, rememberMe).catch(
            (err) => {
                enqueueSnackbar('Error occured!', {
                    variant: 'error',
                });
            }
        );

        if (authenticated) navigate('/home');
        else
            enqueueSnackbar('Error occured!', {
                variant: 'error',
            });
    }

    const getDecodedOAuthJwtGoogle = async (clientID, token) => {
        const CLIENT_ID_GOOGLE = clientID;

        try {
            const client = new OAuth2Client(CLIENT_ID_GOOGLE);

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID_GOOGLE,
            });

            return ticket;
        } catch (error) {
            return { status: 500, data: error };
        }
    };

    const handleGoogleLogin = async (response) => {
        console.log(response);
        let clientID = response.clientID;
        let token = response.credential;

        const realUserData = await getDecodedOAuthJwtGoogle(clientID, token);
        console.log(realUserData);
    };

    const handleChangeRememberMe = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <Container
            maxWidth='xs'
            sx={{
                display: 'flex',
                height: '80vh',
                alignItems: 'center',
                justifyItems: 'center',
            }}
        >
            <Grid
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    justifyItems: 'center',
                }}
            >
                <Typography variant='h4'>Sign in</Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        name='username'
                        autoComplete='username'
                        autoFocus
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={rememberMe}
                                color='primary'
                                onChange={handleChangeRememberMe}
                            />
                        }
                        label='Remember me'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        logo_alignment='center'
                        theme='outline'
                    />
                </Box>
            </Grid>
        </Container>
    );
}
