import * as React from 'react';
import { Container, Grid, Button, Typography, Checkbox } from '@mui/material';
import { getSettings, saveSettings, disableOtp, getUserByID } from 'API';
import 'styles/user-settings.css';
import GenerateOtp from 'routes/UserSettings/GenerateOtp';

export default function UserSettings(props) {
    const [settings, setSettings] = React.useState({});
    const [createCalendar, setCreateCalendar] = React.useState(false);
    const [otpEnabled, setOtpEnabled] = React.useState(null);
    const [showOtpWindow, setShowOtpWindow] = React.useState(false);

    React.useEffect(() => {
        syncSettings();
    }, []);

    const syncSettings = () => {
        getUserByID(props.user.id)
            .then((response) => {
                setOtpEnabled(response.otp_enabled);
            })
            .catch((err) => {
                console.error(err);
            });

        getSettings(props.user.id)
            .then((response) => {
                setSettings(response);
                setCreateCalendar(response.create_calendar);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleSaveSettings = () => {
        settings.otp_enabled = otpEnabled;
        settings.create_calendar = createCalendar;

        saveSettings(props.user.id, settings).catch((err) => {
            console.error(err);
        });
    };

    const handleOtp = async () => {
        if (otpEnabled) {
            await disableOtp(props.user.id);
            syncSettings();
        } else setShowOtpWindow(true);
    };

    return (
        <Container className='user-settings' disableGutters>
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
                        My settings
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                        align='center'
                    >
                        Two factor authentication
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        justifySelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {otpEnabled != null ? (
                        <Button
                            variant='contained'
                            sx={{
                                fontSize: '18px',
                                my: 6,
                                width: '100px',
                            }}
                            onClick={handleOtp}
                        >
                            {otpEnabled ? 'Disable' : 'Enable'}
                        </Button>
                    ) : null}
                </Grid>

                <Grid
                    item
                    xs={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                        align='center'
                    >
                        Add events to separate calendar:
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        justifySelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Checkbox
                        sx={{ transform: 'scale(1.5)' }}
                        checked={createCalendar}
                        onChange={(e) => {
                            setCreateCalendar(e.target.checked);
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{
                            fontSize: '18px',
                            my: 6,
                            width: '100px',
                        }}
                        onClick={handleSaveSettings}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
            {showOtpWindow ? (
                <GenerateOtp
                    open={showOtpWindow}
                    close={() => {
                        setShowOtpWindow(false);
                    }}
                    userID={props.user.id}
                    syncSettings={syncSettings}
                />
            ) : null}
        </Container>
    );
}
