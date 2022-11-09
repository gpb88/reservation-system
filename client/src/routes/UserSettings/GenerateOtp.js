import * as React from 'react';
import {
    Grid,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
} from '@mui/material';
import QRCode from 'react-qr-code';
import { generateOtpSecret, verifyOtpSecret, disableOtp } from 'API';
import { useSnackbar } from 'notistack';

export default function GenerateOtp(props) {
    const [secret, setSecret] = React.useState(null);
    const [token, setToken] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        generateOtpSecret(props.userID).then((response) => {
            setSecret(response);
        });
    }, []);

    const handleClose = () => {
        props.close();
    };

    const handleConfirm = () => {
        verifyOtpSecret(props.userID, token)
            .then((response) => {
                if (response.verified) {
                    enqueueSnackbar('Two factor authentication enabled!', {
                        variant: 'success',
                    });
                    props.syncSettings();
                    props.close();
                } else {
                    enqueueSnackbar('Code does not match', {
                        variant: 'error',
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle sx={{ mt: 2, pb: 2 }} variant='h5'>
                Two Factor Authentication (2FA)
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h6'>How to configure?</Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle1'>
                            1. Install authenticator app of your choice (Google
                            Authenticator, Aegis etc.)
                        </Typography>
                        <Typography variant='subtitle1'>
                            2. Add a new entry by clicking the "+" icon
                        </Typography>
                        <Typography variant='subtitle1'>
                            3. Choose "Scan a barcode" option and use your phone
                            camera to scan barcode below
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6'>Scan QR Code</Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        {secret ? (
                            <QRCode value={secret.otpauth_url} size={200} />
                        ) : null}
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 2 }}>
                        <Typography variant='h6'>
                            Can't scan the QRCode? Enter key
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 2 }}>
                        {secret ? (
                            <Typography variant='subtitle2'>
                                {secret.base32}
                            </Typography>
                        ) : null}
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 2 }}>
                        <Typography variant='h6'>Verify token</Typography>
                        <Divider />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <TextField
                            variant='outlined'
                            label='Enter token'
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
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
                    color='info'
                    size='large'
                    onClick={handleClose}
                >
                    Close
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleConfirm}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
