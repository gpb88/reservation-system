import * as React from 'react';
import {
    Button,
    Dialog,
    Grid,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import {
    getMachine,
    getUserByID,
    deleteClass,
    uploadToGoogleCalendar,
} from 'API';
import 'styles/event-card.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Timetable(props) {
    const [user, setUser] = React.useState('');
    const [machine, setMachine] = React.useState('');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getMachine(props.event.machineID).then((response) => {
            setMachine(response);
        });

        getUserByID(props.event.userID).then((response) => {
            setUser(response);
        });
    }, []);

    const handleDelete = () => {
        deleteClass(props.event.ID)
            .then(() => {
                enqueueSnackbar('Event has been successfully deleted!', {
                    variant: 'success',
                });
                props.refreshClasses();
                props.handleClose();
            })
            .catch((err) => {
                enqueueSnackbar('Error occured!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    const handleUploadToGoogleCalendar = async () => {
        uploadToGoogleCalendar(
            props.event.title,
            props.event.start,
            props.event.end
        )
            .then((response) => {
                enqueueSnackbar('Event has been added to your calendar!', {
                    variant: 'success',
                });
                console.log(response);
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            className='event-card'
        >
            <DialogTitle sx={{ mt: 2 }} align='center' variant='h4'>
                {props.event.title}
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
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
                        <Typography variant='h5'>{machine.name}</Typography>
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
                    mb: 2,
                }}
            >
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
                <Button
                    color='error'
                    size='large'
                    variant='contained'
                    onClick={handleDelete}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#9a0007 !important',
                        },
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
