import * as React from 'react';
import { Container, Grid, Button, Typography, Checkbox } from '@mui/material';
import 'styles/my-account.css';
import ChangeEmail from 'routes/MyAccount/Pages/ChangeEmail';
import ChangePassword from 'routes/MyAccount/Pages/ChangePassword';
import TwoStepVerification from 'routes/MyAccount/Pages/TwoStepVerification';
import DeleteAccount from 'routes/MyAccount/Pages/DeleteAccount';

export default function MyAccount(props) {
    const [page, setPage] = React.useState(<ChangeEmail />);

    React.useEffect(() => {}, []);

    const changePage = (newPage) => {
        switch (newPage) {
            case 'Change email':
                setPage(<ChangeEmail />);
                break;
            case 'Change password':
                setPage(<ChangePassword />);
                break;
            case 'Two step verification':
                setPage(<TwoStepVerification />);
                break;
            case 'Delete account':
                setPage(<DeleteAccount />);
                break;
            default:
                setPage(<ChangeEmail />);
                break;
        }
    };

    return (
        <Container className='my-account' disableGutters>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                }}
                spacing={2}
            >
                <Grid item xs={12} sx={{ mt: 6, mb: 4 }}>
                    <Typography variant='h4' align='center'>
                        My account
                    </Typography>
                </Grid>
            </Grid>
            <Container
                className='menu'
                disableGutters
                sx={{ display: 'flex', flexDirection: 'row' }}
            >
                <Container sx={{ width: '30%' }}>
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyItems: 'center',
                            alignItems: 'center',
                            mt: 6,
                        }}
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                sx={{ width: '80%' }}
                                onClick={() => {
                                    changePage('Change email');
                                }}
                            >
                                Email address
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                sx={{ width: '80%' }}
                                onClick={() => {
                                    changePage('Change password');
                                }}
                            >
                                Password
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                sx={{ width: '80%' }}
                                onClick={() => {
                                    changePage('Two step verification');
                                }}
                            >
                                Two-step verification
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                sx={{ width: '80%' }}
                                onClick={() => {
                                    changePage('Delete account');
                                }}
                            >
                                Delete account
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <Container sx={{ width: '70%', mt: 6 }}>{page}</Container>
            </Container>
            <Container className='component' disableGutters></Container>
        </Container>
    );
}
