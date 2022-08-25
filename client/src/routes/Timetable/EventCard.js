import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from 'react-datepicker';
import Typography from '@mui/material/Typography';
import {
    getMachine,
    getUserByID,
    deleteClass,
    uploadToGoogleCalendar,
} from 'API';
import 'styles/event-card.css';
import { useSnackbar } from 'notistack';

export default function Timetable(props) {
    const [user, setUser] = React.useState('');
    const [machine, setMachine] = React.useState('');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
        getMachine(props.event.machineID).then((response) => {
            setMachine(response);
        });

        getUserByID(props.event.userID).then((response) => {
            setUser(response);
        });
    }, []);

    const handleDelete = () => {
        deleteClass(props.event.ID).then((response) => {
            props.refreshClasses();
            props.handleClose();
        });
    };

    const handleUploadToGoogleCalendar = () => {
        let timeZone = 'Europe/Warsaw';

        const event = {
            summary: props.event.title,
            // description: 'Test description',
            start: {
                dateTime: props.event.start,
                timeZone: timeZone,
            },
            end: {
                dateTime: props.event.end,
                timezone: timeZone,
            },
            colorId: 5,
        };

        let eventsArr = [];
        eventsArr.push(event);

        uploadToGoogleCalendar(eventsArr)
            .then((response) => {
                console.log(response);
                enqueueSnackbar('Event has been added to your calendar!', {
                    variant: 'success',
                });
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar('Error occurred', {
                    variant: 'error',
                });
            });
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            className='event-card'
        >
            <DialogTitle variant='h3' sx={{ textAlign: 'center' }}>
                {props.event.title}
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        p: 2,
                    }}
                    spacing={2}
                >
                    <Grid item xs={4}>
                        <Typography variant='h5'>Reserved by: </Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ justifyContent: 'center' }}>
                        <Typography variant='h5'>{user.username}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant='h5'>Machine: </Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ justifyContent: 'center' }}>
                        <Typography variant='h5'>
                            {machine.machine_name}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant='h5'>Begins: </Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ justifyContent: 'center' }}>
                        <DatePicker
                            className='date-picker'
                            disabled
                            selected={props.event.start}
                            dateFormat='MMMM d yyyy, HH:mm'
                            timeFormat='p'
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant='h5'>Ends: </Typography>
                    </Grid>
                    <Grid item xs={8} sx={{ justifyContent: 'center' }}>
                        <DatePicker
                            className='date-picker'
                            disabled
                            selected={props.event.end}
                            dateFormat='MMMM d yyyy, HH:mm'
                            timeFormat='p'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Button size='large' variant='contained' onClick={handleDelete}>
                    Delete
                </Button>
                <Button
                    size='large'
                    variant='outlined'
                    onClick={handleUploadToGoogleCalendar}
                    sx={{
                        '&:hover': {
                            borderColor: '#1565c0',
                            backgroundColor: '#c8e4fb',
                            color: '#1565c0',
                        },
                    }}
                >
                    <img
                        width='24'
                        src='/images/google.png'
                        alt='google'
                        style={{ marginRight: '10px' }}
                    />
                    Add to Google Calendar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
