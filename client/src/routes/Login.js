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
    DialogTitle,
    Dialog,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { verifyCredentials, generateTokens } from 'services/handleLogin';
import { verifyOtpSecret, getUserByExternalId, addExternalUser } from 'API';
import { GoogleLogin } from '@react-oauth/google';
import { OAuth2Client } from 'google-auth-library';
import { useSnackbar } from 'notistack';

export default function Login(props) {
    let navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [token, setToken] = React.useState('');
    const [showOtpWindow, setShowOtpWindow] = React.useState(false);
    const [userId, setUserId] = React.useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const loginUser = {
            username: data.get('username'),
            password: data.get('password'),
        };

        // ? Equals user data/false
        const authenticatedUser = await verifyCredentials(loginUser).catch(
            (err) => {
                enqueueSnackbar('Error occured!', {
                    variant: 'error',
                });
            }
        );

        console.log(authenticatedUser);

        if (authenticatedUser !== false) {
            if (authenticatedUser.otp_enabled) {
                setUserId(authenticatedUser.id);
                setShowOtpWindow(true);
            } else {
                generateTokens(authenticatedUser.id, props.rememberMe).then(
                    () => navigate('/home')
                );
            }
        }
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
        const clientID = response.clientID;
        const token = response.credential;

        const googleUserData = await getDecodedOAuthJwtGoogle(clientID, token);
        console.log(googleUserData);

        try {
            const authenticatedUser = await getUserByExternalId(
                googleUserData.payload.sub,
                'GOOGLE'
            );

            if (authenticatedUser.otp_enabled) {
                setUserId(authenticatedUser.id);
                setShowOtpWindow(true);
            } else {
                generateTokens(authenticatedUser.id, props.rememberMe).then(
                    () => navigate('/home')
                );
            }
        } catch (err) {
            const newUser = await addExternalUser(
                googleUserData.payload.name,
                googleUserData.payload.sub,
                'GOOGLE'
            );

            generateTokens(newUser.id, props.rememberMe).then(() => {
                navigate('/home');
            });
        }
    };

    const handleChangeRememberMe = (event) => {
        props.setRememberMe(event.target.checked);
    };

    const handleOtpVerification = async () => {
        const verified = await verifyOtpSecret(userId, token);
        if (verified) {
            generateTokens(userId, props.rememberMe).then(() => {
                navigate('/home');
            });
        } else {
            enqueueSnackbar('Error occured!', {
                variant: 'error',
            });
        }
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
                                value={props.rememberMe}
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
            {showOtpWindow ? (
                <Dialog
                    open={showOtpWindow}
                    onClose={() => setShowOtpWindow(false)}
                >
                    <DialogTitle sx={{ mt: 2 }}>
                        Please enter your OTP key
                        <Divider sx={{ mt: 1 }} />
                    </DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <TextField
                            variant='outlined'
                            label='Enter token'
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                            }}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <Button
                            variant='outlined'
                            size='large'
                            onClick={() => setShowOtpWindow(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={handleOtpVerification}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}
        </Container>
    );
}
