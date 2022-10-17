import * as React from 'react';
import { Container, Grid, Button, Typography, Checkbox } from '@mui/material';
import { BlockPicker } from 'react-color';
import { getEventColors, getSettings, saveSettings } from 'API';
import 'styles/user-settings.css';

export default function UserSettings(props) {
    const [colors, setColors] = React.useState([]);
    const [settings, setSettings] = React.useState({});

    React.useEffect(() => {
        getSettings(props.user.user_id)
            .then((response) => {
                // ? Reassing array of object to single object
                const settingsObj = response.reduce(
                    (obj, item) =>
                        Object.assign(obj, { [item.key]: item.value }),
                    {}
                );

                setSettings(settingsObj);
            })
            .catch((err) => {
                console.error(err);
            });

        getEventColors()
            .then((response) => {
                let objArr = Object.values(response);
                let colorArr = [];
                objArr.forEach((obj) => {
                    colorArr.push(obj.background);
                });

                setColors(colorArr);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleSaveSettings = () => {
        saveSettings(props.user.user_id, settings).catch((err) => {
            console.error(err);
        });
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
                        Google event color:
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
                    <BlockPicker
                        onChange={(color) => {
                            let newSettings = { ...settings };
                            newSettings.google_event_color = String(
                                colors.indexOf(color.hex)
                            );

                            setSettings(newSettings);
                        }}
                        className='color-picker'
                        colors={colors}
                        width='auto'
                        color={colors[Number(settings.google_event_color)]}
                        triangle='hide'
                    />
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
                        checked={
                            settings.add_events_to_separate_calendar === 'true'
                        }
                        onChange={(e) => {
                            let newSettings = { ...settings };
                            newSettings.add_events_to_separate_calendar =
                                String(e.target.checked);

                            setSettings(newSettings);
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
        </Container>
    );
}
