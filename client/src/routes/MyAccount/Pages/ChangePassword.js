import * as React from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { hashPass } from 'services/password';
import { useSnackbar } from 'notistack';
import 'styles/my-account.css';

export default function ChangePassword(props) {
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        resetVariables();
    }, []);

    const resetVariables = () => {
        setPassword1('');
        setPassword2('');
    };

    async function handleSave() {
        if (!password1 || !password2)
            enqueueSnackbar('Fill all fields!', {
                variant: 'error',
            });
        else if (password1 !== password2)
            enqueueSnackbar('Passwords do not match!', {
                variant: 'error',
            });
        else {
            // addUser(username, role, hashPass(password1)).then(() => {
            //     enqueueSnackbar('User has been added!', {
            //         variant: 'success',
            //     });
            //     props.refreshData();
            //     props.handleClose();
            // });
        }
    }

    return (
        <Container
            className='change-password'
            disableGutters
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant='h6' align='center' sx={{ mb: 3 }}>
                Change password
            </Typography>
            <TextField
                variant='outlined'
                type='password'
                label='Enter password'
                value={password1}
                onChange={(e) => {
                    setPassword1(e.target.value);
                }}
                sx={{ mb: 2, width: '50%' }}
            />
            <TextField
                variant='outlined'
                type='password'
                label='Confirm password'
                value={password2}
                onChange={(e) => {
                    setPassword2(e.target.value);
                }}
                sx={{ mb: 2, width: '50%' }}
            />
            <Button
                variant='contained'
                sx={{ width: '20%' }}
                onClick={handleSave}
            >
                Save
            </Button>
        </Container>
    );
}
